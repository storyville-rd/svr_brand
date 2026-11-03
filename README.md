# Storyville RD Brand

The single source of truth for Storyville RD's brand in code: color and type tokens, fonts, logos and React components. Every Storyville app links these files from the jsDelivr CDN, so a brand change made here reaches every app.

Brand rules (when to use which color, type and logo): **[docs/BRAND.md](docs/BRAND.md)**.
Accessibility rules (alt text, keyboard, shared shortcuts, motion, captions, forms): **[docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md)**. Every app follows both.

## Use it in an app

Every link below is pinned to a release tag (`@v2.0.0`). Pin your app to a tag, never `@main`, so a brand change only reaches an app when you choose to update it.

### 1. Styles (fonts, tokens and component styles)

One stylesheet loads the Bebas Neue and Source Sans 3 fonts (served from this repo, no Google Fonts), every CSS variable and type class, and the component styles:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/storyville-rd/svr_brand@v2.0.0/dist/storyville.css">
```

In a Vite or Next.js app, put that `<link>` in `index.html` (Vite) or the root layout's `<head>` (Next.js). Then use the variables anywhere:

```css
.hero { background: var(--color-bg-light); color: var(--color-text-primary); }
.hero h1 { font-family: var(--font-display); color: var(--color-accent); }
```

or the type classes: `svr-display-h1`, `svr-subheading-h2`, `svr-eyebrow`, `svr-body`, `svr-caption`, `svr-table-header`, `svr-table-body`.

Tokens only, without fonts or component styles: `tokens/tokens.css`. Fonts only: `fonts/fonts.css`. Raw values for tools and scripts: `tokens/tokens.json`.

Don't add a Google Fonts link to any app: the fonts already come with `storyville.css`. Both are under the SIL Open Font License (`fonts/OFL-*.txt`), which allows self-hosting and bundling.

### 2. Logos

```html
<img src="https://cdn.jsdelivr.net/gh/storyville-rd/svr_brand@v2.0.0/logos/storyville-logo-horizontal-charcoal.png" alt="Storyville RD">
```

| File (in `logos/`) | Use | Alt text |
| --- | --- | --- |
| `storyville-logo-stacked-{charcoal,offwhite}.png` | Primary logo: mark, wordmark and tagline | `Storyville RD. Your Path. Your Story.` |
| `storyville-logo-horizontal-{charcoal,offwhite}.png` | Mark beside the wordmark: headers, letterhead, email signatures | `Storyville RD` |
| `storyville-wordmark-{charcoal,offwhite}.png` | Wordmark alone | `Storyville RD` |
| `storyville-mark-{charcoal,offwhite}.png` | The S-road mark alone: favicons, avatars | `Storyville RD` alone; `alt=""` when the name is beside it |

A logo's alt text is the text it contains; never add "logo" or "image of".

Charcoal goes on light grounds (`color-bg-light`, `color-surface-alt`); off-white goes on `color-bg-dark` and `color-accent`.

### 3. React components

`Button`, `Eyebrow`, `SectionHeader`, `Callout`, `Table`, `Card`, `Surface`. Docs: [docs/components/](docs/components/). Props: [components/index.d.ts](components/index.d.ts).

- **Vite / Next.js apps:** copy [`react/Storyville.jsx`](react/Storyville.jsx) into the app (e.g. `src/brand/Storyville.jsx`) and import from it. A React build can't import components from a CDN URL, so this one file is copied in; the styles still come from the CDN stylesheet above.

  ```jsx
  import { Button, Surface } from './brand/Storyville';

  <Surface tone="red">
    <h2 className="svr-h2 svr-subheading-h2">Ready to tell your story?</h2>
    <Button>Start your project</Button>
  </Surface>
  ```

- **Plain HTML pages** (no build step): load React 18, then `components/storyville.global.js`, which defines `window.Storyville`.

  ```html
  <script src="https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/storyville-rd/svr_brand@v2.0.0/components/storyville.global.js"></script>
  ```

## Class names

Every class starts with `svr-` so it never collides with an app's own CSS: components (`svr-btn`, `svr-card`, `svr-surface-dark`…) and type styles (`svr-display-h1`, `svr-body`…). Never give an app's own classes the `svr-` prefix. CSS variables (`--color-accent`, `--space-4`…) keep their names.

**Upgrading an app from v1.x to v2.0.0:** bump its links to `@v2.0.0`, copy in the new `react/Storyville.jsx`, and rename any classes the app uses directly: `sv-…` becomes `svr-…`, and the type styles `display-h1`, `subheading-h2`, `eyebrow`, `body`, `caption`, `table-header`, `table-body` become `svr-display-h1` and so on.

## Changing the brand

1. Edit `tokens/tokens.json` (colors, type, spacing), `css/components.css` (component styles), `fonts/fonts.css` and the font files, the files in `logos/`, or `docs/`.
2. Run `node scripts/build.mjs` to regenerate `tokens/tokens.css` and `dist/storyville.css`. Never edit those two by hand.
3. Commit, push, and publish a new release tag (`v1.0.1` for fixes, `v1.1.0` for additions, `v2.0.0` if a token is renamed or removed).
4. Bump the tag in each app's links when you want that app to pick up the change.
5. Re-sync the Storyville RD design system in Claude from this repo so the design system matches it.

Component changes go in both `react/Storyville.jsx` and `components/storyville.global.js`.

## Layout

```
dist/storyville.css            fonts + tokens + component styles (what apps link)
fonts/                         Bebas Neue + Source Sans 3 (WOFF2), fonts.css, licenses
tokens/tokens.json             source of truth for every token
tokens/tokens.css              generated CSS variables and type classes
css/components.css             component styles (source)
components/storyville.global.js  components for plain HTML pages (window.Storyville)
components/index.d.ts          component props
react/Storyville.jsx           components for React apps (copy in)
logos/                         8 logo PNGs + usage notes
docs/BRAND.md                  brand guidelines
docs/ACCESSIBILITY.md          alt text, keyboard, shortcuts, motion, captions, forms
docs/components/               one usage doc per component
scripts/build.mjs              regenerates the CSS (no dependencies)
```
