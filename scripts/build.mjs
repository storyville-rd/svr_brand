// Regenerates tokens/tokens.css and dist/storyville.css from tokens/tokens.json, fonts/fonts.css and css/components.css.
// Run from the repo root: node scripts/build.mjs   (no dependencies)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const t = JSON.parse(readFileSync('tokens/tokens.json', 'utf8'));
const themes = t.color.themes.map((th) => th.id); // first = light (default), then dark
const [first, ...others] = themes;
const val = (v, theme) => {
  const raw = typeof v === 'string' ? v : (v[theme] ?? v[first]);
  return raw.replace(/^\{(.+)\}$/, 'var(--$1)');
};
const themed = (c) => typeof c.value === 'object';
const decl = (name, value) => `    --${name}: ${value};`;

const out = [];
out.push('/* Storyville RD — generated from tokens/tokens.json by scripts/build.mjs. Do not edit by hand. */');
out.push('@layer svr {');
out.push(`  :root, [data-theme="${first}"] {`);
out.push(`    color-scheme: ${first};`);
for (const c of t.color.tokens) out.push(decl(c.name, val(c.value, first)));
for (const fam of Object.keys(t)) {
  if (['name', 'version', 'meta', 'color', 'type'].includes(fam) || !t[fam]?.tokens) continue;
  for (const x of t[fam].tokens) out.push(decl(x.name, x.value));
}
for (const [k, v] of Object.entries(t.type.families)) out.push(decl(`svr-font-${k}`, v));
out.push('  }');
for (const th of others) {
  const block = t.color.tokens.filter(themed).map((c) => decl(c.name, val(c.value, th)));
  out.push(`  [data-theme="${th}"] {`, `    color-scheme: ${th};`, ...block, '  }');
  // No toggle choice yet: follow the device setting.
  out.push(`  @media (prefers-color-scheme: ${th}) {`, `    :root:not([data-theme="${first}"]) {`, `      color-scheme: ${th};`,
    ...block.map((l) => '  ' + l), '    }', '  }');
}
for (const g of t.type.groups) for (const s of g.styles) {
  const fam = s.family || g.family;
  out.push(`  .${s.name} { font-family: var(--svr-font-${fam}); font-size: ${s.fontSize}; line-height: ${s.lineHeight}; font-weight: ${s.fontWeight};${s.letterSpacing ? ` letter-spacing: ${s.letterSpacing};` : ''} }`);
}
out.push('}');
const tokensCss = out.join('\n') + '\n';
writeFileSync('tokens/tokens.css', tokensCss);

// Self-hosted fonts: fonts/fonts.css points at ./file.woff2; from dist/ the same files are ../fonts/file.woff2.
const fonts = readFileSync('fonts/fonts.css', 'utf8').replaceAll("url('./", "url('../fonts/");
mkdirSync('dist', { recursive: true });
writeFileSync('dist/storyville.css', fonts + '\n' + tokensCss + '\n' + readFileSync('css/components.css', 'utf8'));
console.log('Built tokens/tokens.css and dist/storyville.css');
