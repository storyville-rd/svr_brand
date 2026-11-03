// Regenerates tokens/tokens.css and dist/storyville.css from tokens/tokens.json, fonts/fonts.css and css/components.css.
// Run from the repo root: node scripts/build.mjs   (no dependencies)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const t = JSON.parse(readFileSync('tokens/tokens.json', 'utf8'));
const first = t.color.themes[0].id;
const colorVal = (v) => (typeof v === 'string' ? v : v[first]).replace(/^\{(.+)\}$/, 'var(--$1)');
const lines = [];
lines.push('/* Storyville RD — generated from tokens/tokens.json by scripts/build.mjs. Do not edit by hand. */');
lines.push(':root {');
for (const c of t.color.tokens) lines.push(`  --${c.name}: ${colorVal(c.value)};`);
for (const fam of Object.keys(t)) {
  if (['name', 'version', 'meta', 'color', 'type'].includes(fam) || !t[fam]?.tokens) continue;
  for (const x of t[fam].tokens) lines.push(`  --${x.name}: ${x.value};`);
}
for (const [k, v] of Object.entries(t.type.families)) lines.push(`  --font-${k}: ${v};`);
lines.push('}');
for (const g of t.type.groups) for (const s of g.styles) {
  const fam = s.family || g.family;
  lines.push(`.${s.name} { font-family: var(--font-${fam}); font-size: ${s.fontSize}; line-height: ${s.lineHeight}; font-weight: ${s.fontWeight};${s.letterSpacing ? ` letter-spacing: ${s.letterSpacing};` : ''} }`);
}
const tokensCss = lines.join('\n') + '\n';
writeFileSync('tokens/tokens.css', tokensCss);

// Self-hosted fonts: fonts/fonts.css points at ./file.woff2; from dist/ the same files are ../fonts/file.woff2.
const fonts = readFileSync('fonts/fonts.css', 'utf8').replaceAll("url('./", "url('../fonts/");
mkdirSync('dist', { recursive: true });
writeFileSync('dist/storyville.css', fonts + '\n' + tokensCss + '\n' + readFileSync('css/components.css', 'utf8'));
console.log('Built tokens/tokens.css and dist/storyville.css');
