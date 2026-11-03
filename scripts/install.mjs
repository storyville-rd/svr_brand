#!/usr/bin/env node
// Installs a svr_brand release into an app, identically every time. Zero dependencies; Node 18+.
// Run it from the app's root folder (npm scripts do).
//
//   node install.mjs <tag> <dest> [--public <dir>] [--docs <dir>] [--repo owner/name] [--commit <sha>] [--from <checkout>]
//   node install.mjs --check  [<dest>] [--public <dir>] [--docs <dir>]
//   node install.mjs --latest [<dest>] [--repo owner/name]
//
//   <tag>     a release tag, e.g. v3.3.0
//   <dest>    where the release goes in the app, e.g. vendor/svr_brand (replaced completely). Default for --check/--latest: vendor/svr_brand
//   --public  also copy the files the browser must load as-is (js/theme.js, icons/) into this folder, e.g. public/svr.
//             Vite bundles the CSS and fonts; it does not bundle these.
//   --docs    also install the brand docs (BRAND.md, ACCESSIBILITY.md, EMAIL.md, component docs, CLAUDE-snippet.md, README,
//             CHANGELOG, INSTALL) into this folder, e.g. docs/brand, so people and Claude can read them inside the app.
//   --repo    default storyville-rd/svr_brand
//   --commit  install this exact commit instead of looking the tag up through the GitHub API (or when rate-limited)
//   --from    install from a local checkout of svr_brand instead of GitHub (bootstrap, offline, testing)
//   --check   verify an installed copy against its manifest; exits 1 if anything is missing, extra or changed.
//             --public/--docs default to the folders recorded at install time.
//   --latest  print the newest release tag and whether the installed copy is behind (exits 0 either way)
//
// GITHUB_TOKEN raises the GitHub API rate limit (60 requests/hour without it; an install or --latest uses one).
// Install: resolves the tag to a commit SHA, downloads manifest.json and every release file at that commit, checks each
// file's size and sha256 against the manifest, then swaps the new copy into <dest> and writes <dest>/INSTALLED.json
// (tag, version, commit, folders, date). Nothing in <dest> changes if any check fails.
import { createHash } from 'node:crypto';
import { mkdir, writeFile, readFile, rm, rename, readdir, stat } from 'node:fs/promises';
import { dirname, join, resolve, relative } from 'node:path';

// Release files an app installs (including this script, so `npm run brand:install` can run it from the installed copy).
const INSTALL = [/^VERSION$/, /^dist\//, /^fonts\//, /^js\//, /^icons\//, /^logos\//, /^react\//, /^components\/(storyville\.global\.js|index\.d\.ts)$/, /^scripts\/install\.mjs$/];
const PUBLIC = [/^js\/theme\.js$/, /^icons\//];
const DOCS = [/^docs\//, /^README\.md$/, /^CHANGELOG\.md$/, /^INSTALL\.md$/];
const RECORD = 'INSTALLED.json';
// Written into every folder the installer owns, so git never rewrites line endings there (Windows core.autocrlf).
const GITATTRIBUTES = '# Written by the svr_brand installer: keep these files byte-for-byte identical to the release.\n* -text\n';

const args = process.argv.slice(2);
const flag = (name) => { const i = args.indexOf(name); if (i < 0) return undefined; const v = args[i + 1]; args.splice(i, 2); return v; };
const has = (name) => { const i = args.indexOf(name); if (i < 0) return false; args.splice(i, 1); return true; };
const die = (msg, code = 1) => { console.error(`svr_brand install: ${msg}`); process.exit(code); };
const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');
const wanted = (path, set) => set.some((re) => re.test(path));
const rel = (p) => relative('.', p).split('\\').join('/') || '.';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const mode = has('--check') ? 'check' : has('--latest') ? 'latest' : 'install';
const repo = flag('--repo') || 'storyville-rd/svr_brand';
const pinCommit = flag('--commit');
const from = flag('--from');
let pub = flag('--public');
let docs = flag('--docs');
if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) die(`bad --repo "${repo}"`);

// ---------- helpers ----------
async function walk(dir, base = dir) {
  const out = [];
  for (const n of await readdir(dir)) {
    const p = join(dir, n);
    if ((await stat(p)).isDirectory()) out.push(...(await walk(p, base))); else out.push(relative(base, p).split('\\').join('/'));
  }
  return out;
}
const readJson = async (p) => { try { return JSON.parse(await readFile(p, 'utf8')); } catch { return null; } };
const semver = (t) => (t.replace(/^v/, '').match(/^(\d+)\.(\d+)\.(\d+)$/) || []).slice(1).map(Number);
const newer = (a, b) => { const x = semver(a), y = semver(b); for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] > y[i]; return false; };

async function http(url, accept) {
  const headers = { 'User-Agent': 'svr_brand-install' };
  if (accept) headers.Accept = accept;
  if (process.env.GITHUB_TOKEN && url.startsWith('https://api.github.com/')) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  let res;
  try { res = await fetch(url, { headers }); } catch (e) { die(`can't reach ${new URL(url).host}: ${e.cause?.code || e.message}`); }
  if (!res.ok) die(`${res.status} ${res.statusText} for ${url}${res.status === 403 || res.status === 429 ? ' (rate-limited? set GITHUB_TOKEN, or pass --commit)' : res.status === 401 ? ' (GITHUB_TOKEN is set but invalid or expired: fix or unset it)' : ''}`);
  return Buffer.from(await res.arrayBuffer());
}

// Windows can briefly lock folders (antivirus, an editor, a dev-server watcher). Retry those; fail on anything else.
async function retry(fn, what) {
  for (let i = 0; ; i++) {
    try { return await fn(); } catch (e) {
      if (!['EBUSY', 'EPERM', 'EACCES', 'ENOTEMPTY'].includes(e.code) || i >= 9) {
        throw new Error(`${what}: ${e.code || e.message}${['EBUSY', 'EPERM', 'EACCES'].includes(e.code) ? ' (a program may have the folder open: stop the dev server or close the editor and try again)' : ''}`);
      }
      await sleep(150 * (i + 1));
    }
  }
}

// Compare one installed file with its manifest entry; explain line-ending-only differences.
function compare(buf, f) {
  if (buf.length === f.bytes && sha256(buf) === f.sha256) return null;
  const lf = Buffer.from(buf.toString('latin1').replace(/\r\n/g, '\n'), 'latin1');
  if (lf.length === f.bytes && sha256(lf) === f.sha256) return 'crlf';
  return 'changed';
}

async function verify(dest, publicDir, docsDir) {
  const manifest = await readJson(join(dest, 'manifest.json'));
  if (!manifest) throw new Error(`no manifest.json in ${rel(dest)}`);
  const problems = [];
  let crlf = false;
  const groups = [[dest, INSTALL, true], [publicDir, PUBLIC, !!publicDir], [docsDir, DOCS, !!docsDir]];
  for (const [root, set, on] of groups) {
    if (!on) continue;
    const expect = manifest.files.filter((f) => wanted(f.path, set));
    for (const f of expect) {
      const p = join(root, f.path);
      let buf;
      try { buf = await readFile(p); } catch { problems.push(`missing: ${rel(p)}`); continue; }
      const why = compare(buf, f);
      if (why === 'crlf') { crlf = true; problems.push(`differs only in line endings (git autocrlf): ${rel(p)}`); }
      else if (why) problems.push(`changed: ${rel(p)}`);
    }
    // The installer owns dest and docsDir completely, so anything else there is extra. The public folder may be shared.
    if (root !== publicDir) {
      const known = new Set([...expect.map((f) => f.path), '.gitattributes', ...(root === dest ? ['manifest.json', RECORD] : [])]);
      for (const p of await walk(root).catch(() => [])) if (!known.has(p)) problems.push(`extra: ${rel(join(root, p))}`);
    }
  }
  return { manifest, problems, crlf };
}

// ---------- --latest ----------
async function latestTag() {
  let page = 1, best = null;
  for (;;) {
    const tags = JSON.parse((await http(`https://api.github.com/repos/${repo}/tags?per_page=100&page=${page}`, 'application/vnd.github+json')).toString('utf8'));
    for (const t of tags) if (semver(t.name).length === 3 && (!best || newer(t.name, best))) best = t.name;
    if (tags.length < 100) return best;
    page++;
  }
}

if (mode === 'latest') {
  const dest = resolve(args[0] || 'vendor/svr_brand');
  const rec = await readJson(join(dest, RECORD));
  const latest = await latestTag();
  if (!latest) die(`no release tags found in ${repo}`);
  if (!rec) { console.log(`Latest svr_brand release: ${latest}. Nothing installed in ${rel(dest)} yet.`); process.exit(0); }
  if (newer(latest, rec.tag)) {
    console.log(`svr_brand is behind: ${rel(dest)} has ${rec.tag}; the latest release is ${latest}.`);
    console.log(`Update: change the tag in the app's brand:install script to ${latest}, run it, and read CHANGELOG.md for anything to change.`);
  } else console.log(`svr_brand is up to date: ${rel(dest)} has ${rec.tag}, the latest release.`);
  process.exit(0);
}

// ---------- --check ----------
if (mode === 'check') {
  const dest = resolve(args[0] || 'vendor/svr_brand');
  const rec = (await readJson(join(dest, RECORD))) || {};
  pub = pub || rec.public; docs = docs || rec.docs;
  let result;
  try { result = await verify(dest, pub && resolve(pub), docs && resolve(docs)); } catch (e) { die(e.message); }
  const { manifest, problems, crlf } = result;
  if (problems.length) {
    console.error(`svr_brand ${manifest.version} in ${rel(dest)}: ${problems.length} problem(s)\n  ${problems.join('\n  ')}`);
    if (crlf) console.error(`\nLine-ending fix (Windows): git rewrote these files with CRLF. Reinstall (the installer writes a .gitattributes with "* -text" into its folders), or add to the app's .gitattributes:\n  ${rel(dest)}/** -text${pub ? `\n  ${rel(resolve(pub))}/** -text` : ''}${docs ? `\n  ${rel(resolve(docs))}/** -text` : ''}\nthen run: git add --renormalize . && npm run brand:install`);
    process.exit(1);
  }
  console.log(`svr_brand ${manifest.version} in ${rel(dest)} matches its manifest${rec.commit ? ` (${rec.tag} @ ${String(rec.commit).slice(0, 12)})` : ''}.`);
  process.exit(0);
}

// ---------- install ----------
const [tag, destArg] = args;
if (!tag || !destArg) die('usage: install.mjs <tag> <dest> [--public <dir>] [--docs <dir>] [--repo owner/name] [--commit <sha>] [--from <checkout>]');
if (!semver(tag).length) die(`"${tag}" isn't a release tag like v3.3.0`);
const dest = resolve(destArg);
const pubDir = pub && resolve(pub);
const docsDir = docs && resolve(docs);
for (const d of [pubDir, docsDir]) if (d && (d === dest || d.startsWith(dest + '/') || d.startsWith(dest + '\\'))) die(`--public/--docs must be outside ${destArg}`);

let commit = pinCommit;
let fetchFile;
if (from) {
  fetchFile = (p) => readFile(join(resolve(from), p));
  commit = commit || 'local';
} else {
  if (!commit) commit = (await http(`https://api.github.com/repos/${repo}/commits/${encodeURIComponent(tag)}`, 'application/vnd.github.sha')).toString('utf8').trim();
  if (!pinCommit && !/^[0-9a-f]{7,40}$/.test(commit)) die(`couldn't resolve ${tag} to a commit (got "${commit.slice(0, 40)}")`);
  fetchFile = (p) => http(`https://raw.githubusercontent.com/${repo}/${commit}/${p.split('/').map(encodeURIComponent).join('/')}`);
}

const manifestBuf = await fetchFile('manifest.json').catch((e) => die(`can't read manifest.json: ${e.message}`));
const manifest = JSON.parse(manifestBuf.toString('utf8'));
if (manifest.version !== tag.replace(/^v/, '')) die(`manifest at ${tag} says version ${manifest.version}; refusing to install a mismatched release`);
for (const f of manifest.files) if (f.path.includes('..') || f.path.startsWith('/') || f.path.includes('\\')) die(`unsafe path in manifest: ${f.path}`);

// Stage everything first; touch nothing in the app until every file has checked out.
const stamp = `${process.pid}-${Date.now()}`;
const stages = [];
const cleanup = () => Promise.all(stages.map((s) => rm(s, { recursive: true, force: true }).catch(() => {})));
async function stageFolder(target, set, extra = {}) {
  const stage = `${target}.installing-${stamp}`;
  stages.push(stage);
  const files = manifest.files.filter((f) => wanted(f.path, set));
  for (const f of files) {
    const buf = await fetchFile(f.path);
    if (compare(buf, f)) throw new Error(`${f.path} doesn't match the manifest (corrupted download?)`);
    await mkdir(dirname(join(stage, f.path)), { recursive: true });
    await writeFile(join(stage, f.path), buf);
  }
  await mkdir(stage, { recursive: true });
  for (const [name, content] of Object.entries(extra)) await writeFile(join(stage, name), content);
  return { stage, files };
}
// Replace `target` with `stage`. Only "doesn't exist yet" is ignored; locked folders are retried; on failure the old copy comes back.
async function swap(target, stage) {
  await mkdir(dirname(target), { recursive: true });
  const old = `${target}.old-${stamp}`;
  let hadOld = true;
  try { await retry(() => rename(target, old), `can't move the current ${rel(target)} aside`); }
  catch (e) { if (e.message.includes('ENOENT')) hadOld = false; else throw e; }
  try { await retry(() => rename(stage, target), `can't put the new ${rel(target)} in place`); }
  catch (e) { if (hadOld) await rename(old, target).catch(() => {}); throw e; }
  if (hadOld) await rm(old, { recursive: true, force: true }).catch(() => console.warn(`svr_brand install: couldn't remove ${rel(old)}; delete it by hand`));
}

let n = 0;
try {
  const record = { name: 'svr_brand', repo, tag, version: manifest.version, commit, public: pub ? rel(pubDir) : undefined, docs: docs ? rel(docsDir) : undefined, installedAt: new Date().toISOString() };
  const main = await stageFolder(dest, INSTALL, { 'manifest.json': manifestBuf, [RECORD]: JSON.stringify(record, null, 2) + '\n', '.gitattributes': GITATTRIBUTES });
  const docsStage = docsDir ? await stageFolder(docsDir, DOCS, { '.gitattributes': GITATTRIBUTES }) : null;
  n = main.files.length;
  await swap(dest, main.stage);
  if (docsStage) await swap(docsDir, docsStage.stage);
  if (pubDir) {
    // The public folder may hold the app's other files, so copy into it instead of replacing it.
    for (const f of main.files.filter((x) => wanted(x.path, PUBLIC))) {
      await mkdir(dirname(join(pubDir, f.path)), { recursive: true });
      await retry(async () => writeFile(join(pubDir, f.path), await readFile(join(dest, f.path))), `can't write ${rel(join(pubDir, f.path))}`);
    }
    await writeFile(join(pubDir, '.gitattributes'), GITATTRIBUTES).catch(() => {});
  }
} catch (e) {
  await cleanup();
  die(e.message);
}
await cleanup();

const { problems } = await verify(dest, pubDir, docsDir);
if (problems.length) die(`installed, but the check failed:\n  ${problems.join('\n  ')}`);
console.log(`Installed svr_brand ${manifest.version} (${tag} @ ${String(commit).slice(0, 12)}) into ${destArg}: ${n} files${pub ? `; theme.js and icons in ${pub}` : ''}${docs ? `; docs in ${docs}` : ''}.`);
