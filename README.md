# Storyville RD Brand

The single source of truth for Storyville RD's brand in code: color and type tokens (light and dark), fonts, logos, the light/dark toggle and React components. Every Storyville app links these files from the jsDelivr CDN, so a brand change made here reaches every app.

Brand rules (when to use which color, type and logo): **[docs/BRAND.md](docs/BRAND.md)**.
Accessibility rules (alt text, keyboard, shared shortcuts, motion, captions, forms): **[docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md)**. Every app follows both.

## Use it in an app

Every link below is pinned to a release tag (`@v3.0.0`). Pin your app to a tag, never `@main`, so a brand change only reaches an app when you choose to update it.

### 1. The `<head>`: layer order, theme, styles

Put these three lines at the very top of every app's `<head>`, in this order:

```html
<style>@layer theme, base, svr, components, utilities;</style>
<script src="https://cdn.jsdelivr.net/gh/storyville-rd/svr_brand@v3.0.0/js/theme.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/storyville-rd/svr_brand@v3.0.0/dist/storyville.css">
```

- **Line 1 sets the cascade-layer order.** All brand CSS (tokens, type styles, components) lives in the `svr` layer. A browser ranks layers in the order it first sees them, so this statement must come before `storyville.css` and before the app's own CSS; otherwise `svr` would rank below Tailwind's resets. With this order, brand classes sit above Tailwind's `theme` and `base` (preflight) and below `components`, `utilities` and the app's own unlayered CSS. Apps without Tailwind can use the same line.
- **Line 2 applies light or dark mode before the page paints.** It follows the device setting until someone uses the toggle, then remembers their choice for that app.
- **Line 3** loads the bundled fonts (Bebas Neue and Source Sans 3, no Google Fonts), every token for both themes, the type styles and the component styles.

In Vite, these go in `index.html`. In Next.js, put them in the root layout's `<head>`, with the theme script as a plain `<script>` tag so it runs before hydration.

### 2. Tokens

Style everything with the role tokens. They switch values between light and dark, so app CSS never mentions the theme:

```css
.hero { background: var(--svr-color-bg); color: var(--svr-color-text); }
.hero h1 { font-family: var(--svr-font-display); color: var(--svr-color-accent); }
.hero .panel { background: var(--svr-color-surface-alt); border: 1px solid var(--svr-color-border); border-radius: var(--svr-radius-md); padding: var(--svr-space-6); }
```

| Role token | Light | Dark |
| --- | --- | --- |
| `--svr-color-bg` | #FAF8F5 | #211D1B |
| `--svr-color-text` | #211D1B | #D4CECC |
| `--svr-color-heading` | #211D1B | #FAF8F5 |
| `--svr-color-surface-alt` | #F0EDE8 | #2E2926 |
| `--svr-color-border` | #C8C4C0 | #6B625D |
| `--svr-color-accent` | #A72F2F | #E07B72 |
| `--svr-color-accent-fill` | #A72F2F | #A72F2F |
| `--svr-color-on-accent` | #FAF8F5 | #FAF8F5 |

Also defined:

- **Palette constants** (`--svr-palette-red`, `--svr-palette-offwhite`, `--svr-palette-charcoal` and the rest), for the rare thing that must not change with the theme.
- **Spacing:** `--svr-space-1` to `--svr-space-12`.
- **Radius:** `--svr-radius-none`, `-sm`, `-md`.
- **Rules:** `--svr-rule-accent`, `--svr-rule-hairline`.
- **Fonts:** `--svr-font-display`, `--svr-font-body`.
- **Type classes:** `svr-display-h1`, `svr-subheading-h2`, `svr-eyebrow`, `svr-body`, `svr-caption`, `svr-table-header`, `svr-table-body`.

Separate pieces are also available:

- `tokens/tokens.css`: tokens and type classes only.
- `fonts/fonts.css`: fonts only.
- `tokens/tokens.json`: raw values for tools and scripts.

### 3. Light and dark mode

Every app carries a light/dark toggle. `js/theme.js` does the work; the `ThemeToggle` component is the button.

- The theme is the `data-theme` attribute on `<html>` (`light` or `dark`). With no attribute, the tokens follow the device setting.
- Scripts can call `svrTheme.get()`, `svrTheme.set('light' | 'dark')`, `svrTheme.toggle()` and `svrTheme.reset()` (back to the device setting), and listen for the `svr-themechange` event on `window`.
- React apps can use `useTheme()` from `react/Storyville.jsx`, which returns `[theme, setTheme]`.
- Swap logos with the theme: charcoal files in light mode, off-white files in dark mode.

### 4. Logos

```html
<img src="https://cdn.jsdelivr.net/gh/storyville-rd/svr_brand@v3.0.0/logos/storyville-logo-horizontal-charcoal.png" alt="Storyville RD">
```

| File (in `logos/`) | Use | Alt text |
| --- | --- | --- |
| `storyville-logo-stacked-{charcoal,offwhite}.png` | Primary logo: mark, wordmark and tagline | `Storyville RD. Your Path. Your Story.` |
| `storyville-logo-horizontal-{charcoal,offwhite}.png` | Mark beside the wordmark: headers, letterhead, email signatures | `Storyville RD` |
| `storyville-wordmark-{charcoal,offwhite}.png` | Wordmark alone | `Storyville RD` |
| `storyville-mark-{charcoal,offwhite}.png` | The S-road mark alone: favicons, avatars | `Storyville RD` alone; `alt=""` when the name is beside it |

A logo's alt text is the text it contains; never add "logo" or "image of". Charcoal goes on light grounds; off-white goes on dark grounds and red bands.

### 5. React components

`Button`, `Eyebrow`, `SectionHeader`, `Callout`, `Table`, `Card`, `Surface`, `ThemeToggle` (plus the `useTheme` hook). Docs: [docs/components/](docs/components/). Props: [components/index.d.ts](components/index.d.ts).

- **Vite / Next.js apps:** copy [`react/Storyville.jsx`](react/Storyville.jsx) into the app (e.g. `src/brand/Storyville.jsx`) and import from it. A React build can't import components from a CDN URL, so this one file is copied in; the styles still come from the CDN. The file starts with `'use client'` for Next.js.

  ```jsx
  import { Button, Surface, ThemeToggle } from './brand/Storyville';

  <header><ThemeToggle /></header>
  <Surface tone="red">
    <h2 className="svr-h2 svr-subheading-h2">Ready to tell your story?</h2>
    <Button>Start your project</Button>
  </Surface>
  ```

- **Plain HTML pages** (no build step): load React 18, then `components/storyville.global.js`, which defines `window.Storyville`.

  ```html
  <script src="https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/storyville-rd/svr_brand@v3.0.0/components/storyville.global.js"></script>
  ```

## Naming and layers

- Everything the system defines starts with `svr-`. That covers classes (`svr-btn`, `svr-surface-inverse`, `svr-display-h1`…) and CSS variables (`--svr-color-accent`, `--svr-space-4`, `--svr-font-display`…). Never give an app's own classes the `svr-` prefix. Apps may use `--svr-` for their own Storyville-wide variables (like Proposal Lab's `--svr-banner-height`), but never in the families the brand reserves: `--svr-color-*`, `--svr-palette-*`, `--svr-space-*`, `--svr-radius-*`, `--svr-rule-*` and `--svr-font-*`.
- All brand CSS is inside `@layer svr { … }`. To override a brand style, write the override in the app's `components` or `utilities` layer, or outside any layer. To override a token for one app, redefine it on `:root` in one of those places.

## Upgrading an app

**From v2.x to v3.0.0:**

1. Add the layer line and `theme.js` to the `<head>` (section 1), bump the links to `@v3.0.0`, and copy in the new `react/Storyville.jsx`.
2. Rename the CSS variables the app uses directly:

| v2 | v3 |
| --- | --- |
| `--color-bg-light` | `--svr-color-bg` |
| `--color-text-primary` | `--svr-color-text` (body copy) or `--svr-color-heading` (titles) |
| `--color-accent` | `--svr-color-accent` (text, rules) or `--svr-color-accent-fill` (fills) |
| `--color-text-reversed` | `--svr-color-on-accent` (on red); inside an inverse band, use `--svr-color-heading` |
| `--color-bg-dark`, `--color-text-body-dark` | Use an inverse `Surface` (`svr-surface-inverse`) and the normal role tokens |
| `--color-surface-alt`, `--color-border` | `--svr-color-surface-alt`, `--svr-color-border` |
| `--space-*`, `--radius-*`, `--rule-*` | `--svr-space-*`, `--svr-radius-*`, `--svr-rule-*` |
| `--font-display`, `--font-body` | `--svr-font-display`, `--svr-font-body` |

3. Rename the classes: `svr-surface-dark` becomes `svr-surface-inverse`, and `svr-surface-light` is gone (a plain `svr-surface` is the default). `svr-table-dark` becomes `svr-table-inverse`. React `tone` and `header` props accept the old names.
4. Add a `ThemeToggle` to the app's header or settings menu, and check every screen in both themes.

**From v1.x:** first apply the v2 class renames (`sv-…` became `svr-…`, and the type styles `display-h1` etc. became `svr-display-h1` etc.), then the steps above.

## Changing the brand

1. Edit `tokens/tokens.json` (colors for both themes, type, spacing), `css/components.css` (component styles), `fonts/fonts.css` and the font files, `js/theme.js`, the files in `logos/`, or `docs/`.
2. Run `node scripts/build.mjs` to regenerate `tokens/tokens.css` and `dist/storyville.css`. Never edit those two by hand.
3. Commit, push, and publish a new release tag (`v3.0.1` for fixes, `v3.1.0` for additions, `v4.0.0` if a token or class is renamed or removed).
4. Bump the tag in each app's links when you want that app to pick up the change.
5. Re-sync the Storyville RD design system in Claude from this repo so the design system matches it.

Component changes go in both `react/Storyville.jsx` and `components/storyville.global.js`.

## Layout

```
dist/storyville.css              fonts + tokens + component styles (what apps link)
js/theme.js                      light/dark mode (load in <head>)
fonts/                           Bebas Neue + Source Sans 3 (WOFF2), fonts.css, licenses
tokens/tokens.json               source of truth for every token, both themes
tokens/tokens.css                generated CSS variables and type classes
css/components.css               component styles (source)
components/storyville.global.js  components for plain HTML pages (window.Storyville)
components/index.d.ts            component props
react/Storyville.jsx             components and useTheme for React apps (copy in)
logos/                           8 logo PNGs + usage notes
docs/BRAND.md                    brand guidelines
docs/ACCESSIBILITY.md            alt text, keyboard, shortcuts, motion, captions, forms
docs/components/                 one usage doc per component
scripts/build.mjs                regenerates the CSS (no dependencies)
```
