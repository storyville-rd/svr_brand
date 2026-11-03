#!/usr/bin/env node
// Installs a svr_brand release into an app, identically every time. Zero dependencies; Node 18+.
//
//   node install.mjs <tag> <dest> [--public <dir>] [--repo owner/name] [--commit <sha>] [--from <local checkout>]
//   node install.mjs --check <dest> [--public <dir>]
//
//   <tag>     a release tag, e.g. v3.2.0
//   <dest>    where the release goes in the app, e.g. vendor/svr_brand (replaced completely)
//   --public  also copy the files the browser must load as-is (js/theme.js, icons/) into this folder,
//             e.g. public/svr. Vite bundles CSS and fonts; it does not bundle these.
//   --repo    default storyville-rd/svr_brand
//   --commit  skip the GitHub API lookup and install this exact commit (or when rate-limited)
//   --from    install from a local checkout instead of GitHub (testing, offline)
//   --check   verify an installed copy against its manifest; exits 1 if anything is missing, extra or changed
//
// Set GITHUB_TOKEN to raise the API rate limit (60 requests/hour without it; an install uses one).
// What it does: resolves the tag to a commit SHA (GitHub API), downloads manifest.json and every listed
// release file at that commit, checks each file's size and sha256 against the manifest, then swaps the new copy
// into <dest> and writes <dest>/INSTALLED.json (tag, version, commit, date). Nothing is written if any check fails.
import { createHash } from 'node:crypto';
import { mkdir, writeFile, readFile, rm, rename, readdir, stat } from 'node:fs/promises';
import { dirname, join, resolve, relative } from 'node:path';

// Release files an app installs (including this script, so `npm run brand:install` can run it from the installed copy).
// Docs and build sources stay in the repo.
const INSTALL = [/^VERSION$/, /^dist\//, /^fonts\//, /^js\//, /^icons\//, /^logos\//, /^react\//, /^components\/(storyville\.global\.js|index\.d\.ts)$/, /^scripts\/install\.mjs$/];
const PUBLIC = [/^js\/theme\.js$/, /^icons\//];
const RECORD = 'INSTALLED.json';

const args = process.argv.slice(2);
const flag = (name) => { const i = args.indexOf(name); if (i < 0) return undefined; const v = args[i + 1]; args.splice(i, 2); return v; };
const has = (name) => { const i = args.indexOf(name); if (i < 0) return false; args.splice(i, 1); return true; };
const die = (msg) => { console.error(`svr_brand install: ${msg}`); process.exit(1); };
const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');
const wanted = (path, set = INSTALL) => set.some((re) => re.test(path));

const check = has('--check');
const repo = flag('--repo') || 'storyville-rd/svr_brand';
const pinCommit = flag('--commit');
const from = flag('--from');
const pub = flag('--public');
if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) die(`bad --repo "${repo}"`);

async function walk(dir, base = dir) {
  const out = [];
  for (const n of await readdir(dir)) {
    const p = join(dir, n);
    if ((await stat(p)).isDirectory()) out.push(...(await walk(p, base))); else out.push(relative(base, p).split('\\').join('/'));
  }
  return out;
}

async function verify(dest, publicDir) {
  const manifest = JSON.parse(await readFile(join(dest, 'manifest.json'), 'utf8'));
  const problems = [];
  const expect = manifest.files.filter((f) => wanted(f.path));
  for (const f of expect) {
    for (const [root, include] of [[dest, true], [publicDir, publicDir && wanted(f.path, PUBLIC)]]) {
      if (!include) continue;
      const p = join(root, f.path);
      try {
        const buf = await readFile(p);
        if (buf.length !== f.bytes || sha256(buf) !== f.sha256) problems.push(`changed: ${relative('.', p)}`);
      } catch { problems.push(`missing: ${relative('.', p)}`); }
    }
  }
  const known = new Set([...expect.map((f) => f.path), 'manifest.json', RECORD]);
  for (const p of await walk(dest)) if (!known.has(p)) problems.push(`extra: ${relative('.', join(dest, p))}`);
  return { manifest, problems };
}

if (check) {
  const dest = args[0] || die('usage: install.mjs --check <dest> [--public <dir>]');
  const { manifest, problems } = await verify(resolve(dest), pub && resolve(pub)).catch((e) => die(`can't read ${dest}: ${e.message}`));
  let rec = {}; try { rec = JSON.parse(await readFile(join(dest, RECORD), 'utf8')); } catch {}
  if (problems.length) { console.error(`svr_brand ${manifest.version} in ${dest}: ${problems.length} problem(s)\n  ${problems.join('\n  ')}`); process.exit(1); }
  console.log(`svr_brand ${manifest.version} in ${dest} matches its manifest${rec.commit ? ` (commit ${rec.commit.slice(0, 12)})` : ''}.`);
  process.exit(0);
}

const [tag, destArg] = args;
if (!tag || !destArg) die('usage: install.mjs <tag> <dest> [--public <dir>] [--repo owner/name] [--commit <sha>] [--from <dir>]');
if (!/^v?\d+\.\d+\.\d+$/.test(tag)) die(`"${tag}" isn't a release tag like v3.2.0`);
const dest = resolve(destArg);

async function http(url, accept) {
  const headers = { 'User-Agent': 'svr_brand-install' };
  if (accept) headers.Accept = accept;
  if (process.env.GITHUB_TOKEN && url.startsWith('https://api.github.com/')) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(url, { headers });
  if (!res.ok) die(`${res.status} ${res.statusText} for ${url}${res.status === 403 || res.status === 429 ? ' (rate-limited? set GITHUB_TOKEN or pass --commit)' : ''}`);
  return Buffer.from(await res.arrayBuffer());
}

let commit = pinCommit;
let fetchFile;
if (from) {
  fetchFile = (p) => readFile(join(resolve(from), p));
  commit = commit || 'local';
} else {
  if (!commit) commit = (await http(`https://api.github.com/repos/${repo}/commits/${encodeURIComponent(tag)}`, 'application/vnd.github.sha')).toString('utf8').trim();
  if (!/^[0-9a-f]{7,40}$/.test(commit) && !pinCommit) die(`couldn't resolve ${tag} to a commit (got "${commit.slice(0, 40)}")`);
  fetchFile = (p) => http(`https://raw.githubusercontent.com/${repo}/${commit}/${p.split('/').map(encodeURIComponent).join('/')}`);
}

const manifestBuf = await fetchFile('manifest.json');
const manifest = JSON.parse(manifestBuf.toString('utf8'));
if (manifest.version !== tag.replace(/^v/, '')) die(`manifest at ${tag} says version ${manifest.version}; refusing to install a mismatched release`);
const files = manifest.files.filter((f) => wanted(f.path));
for (const f of files) if (f.path.includes('..') || f.path.startsWith('/')) die(`unsafe path in manifest: ${f.path}`);

const stage = `${dest}.installing-${process.pid}`;
await rm(stage, { recursive: true, force: true });
let n = 0;
await mkdir(stage, { recursive: true });
await writeFile(join(stage, 'manifest.json'), manifestBuf); // the manifest doesn't list itself
for (const f of files) {
  const buf = await fetchFile(f.path);
  if (buf.length !== f.bytes || sha256(buf) !== f.sha256) { await rm(stage, { recursive: true, force: true }); die(`${f.path} doesn't match the manifest (corrupted download?)`); }
  await mkdir(dirname(join(stage, f.path)), { recursive: true });
  await writeFile(join(stage, f.path), buf);
  n++;
}
const record = { name: 'svr_brand', repo, tag, version: manifest.version, commit, installedAt: new Date().toISOString() };
await writeFile(join(stage, RECORD), JSON.stringify(record, null, 2) + '\n');

// Swap in the new copy.
await mkdir(dirname(dest), { recursive: true });
const old = `${dest}.old-${process.pid}`;
let hadOld = true;
await rename(dest, old).catch(() => { hadOld = false; });
await rename(stage, dest);
if (hadOld) await rm(old, { recursive: true, force: true });

if (pub) {
  const pubDir = resolve(pub);
  for (const f of files.filter((x) => wanted(x.path, PUBLIC))) {
    await mkdir(dirname(join(pubDir, f.path)), { recursive: true });
    await writeFile(join(pubDir, f.path), await readFile(join(dest, f.path)));
  }
}
const { problems } = await verify(dest, pub && resolve(pub));
if (problems.length) die(`installed, but the check failed:\n  ${problems.join('\n  ')}`);
console.log(`Installed svr_brand ${manifest.version} (${tag} @ ${String(commit).slice(0, 12)}) into ${destArg}: ${n} files${pub ? `, plus theme.js and icons in ${pub}` : ''}.`);
