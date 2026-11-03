# Installing svr_brand in an app

There are two ways to use the brand in an app:

- **CDN:** link the files from jsDelivr (see the README). This is simplest, and fine for plain pages and apps without Tailwind.
- **Install (vendor):** keep a copy of a release inside the app. This is required for `dist/tailwind-bridge.css`, which Tailwind processes at build time. It's also the right choice for any Vite, TanStack Start or Next.js app, because the CSS and fonts get bundled with the app.

## 1. Install a release with the script

`scripts/install.mjs` installs a release the same way in every app. It needs Node 18 or later and has no dependencies.

**First time only:** download the script from the release you want and save it in the app as `vendor/svr_brand/scripts/install.mjs`:

```
https://cdn.jsdelivr.net/gh/storyville-rd/svr_brand@v3.2.0/scripts/install.mjs
```

Then add one npm script to the app's `package.json`:

```json
"scripts": {
  "brand:install": "node vendor/svr_brand/scripts/install.mjs v3.2.0 vendor/svr_brand --public public/svr",
  "brand:check": "node vendor/svr_brand/scripts/install.mjs --check vendor/svr_brand --public public/svr"
}
```

Run `npm run brand:install` to install or update, and change the tag in that line to move to a new release. The install includes the script itself, so it stays current.

What the script does:

1. Looks up the commit for the tag through the GitHub API.
2. Downloads `manifest.json` and every release file at that exact commit.
3. Checks each file's size and SHA-256 against the manifest, and refuses a manifest whose version doesn't match the tag.
4. Replaces `vendor/svr_brand/` with the new copy and writes `vendor/svr_brand/INSTALLED.json` (tag, version, resolved commit SHA, date).
5. Copies the files the browser has to load as-is (`js/theme.js` and `icons/`) into `public/svr/`.

If any check fails, nothing is written and the previous copy stays.

`npm run brand:check` verifies an installed copy, including the `public/svr` files, and exits with an error if anything is missing, extra or edited. It's a good step for CI.

Options:

- `GITHUB_TOKEN`: set this environment variable to raise the API rate limit. GitHub allows 60 requests an hour without it, and an install uses one.
- `--commit <sha>`: skips the API lookup.
- `--from <folder>`: installs from a local checkout.
- `--repo owner/name`: installs from a different repo.

`INSTALLED.json` holds the commit, not `VERSION`, because `VERSION` is a release file the manifest checks and has to stay unchanged.

**Never edit installed files in an app.** Change the brand in the svr_brand repo and install the new release. Edits made in an app are lost at the next install, and `brand:check` flags them.

## 2. What gets bundled and what's served as-is

| Files | How the app uses them | Why |
| --- | --- | --- |
| `dist/storyville.css` and `fonts/` | Import them into the app's CSS so Vite or Next bundles them | Bundling inlines and hashes the font files through the stylesheet's `url('../fonts/…')`, so keep `dist/` and `fonts/` side by side as installed |
| `dist/tailwind-bridge.css` | `@import` it in the app's Tailwind CSS | Tailwind has to process it |
| `react/Storyville.jsx` (+ `.d.ts`) | Import it from components | Bundled like app code |
| `js/theme.js` | A plain, blocking `<script src="/svr/js/theme.js">` in `<head>`, served from `public/svr/` (or its contents inlined) | It has to run before the first paint. Bundled module scripts run too late, and the page flashes the wrong theme. |
| `icons/` | `<link rel="icon">` and similar, served from `public/svr/icons/` | Browsers fetch icons by URL, outside the bundle |
| `logos/` | Import the ones you use, or serve them from `public/` | Either works |

## 3. The page `<head>`, by framework

Every app needs the same five things, in this order:

1. The **cascade-layer statement**, before any stylesheet.
2. **`theme.js`**, before the stylesheet, so the theme is set before the first paint.
3. The **stylesheet**.
4. The **favicons and theme color**.
5. **`suppressHydrationWarning` on `<html>`** in React SSR apps. `theme.js` sets `data-theme` on `<html>` before React hydrates, so the attribute won't match the server HTML, and that's expected.

### Vite single-page app (React)

In `index.html`:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>@layer theme, base, svr, components, utilities;</style>
  <script src="/svr/js/theme.js"></script>
  <link rel="icon" href="/svr/icons/favicon.ico" sizes="48x48">
  <link rel="icon" href="/svr/icons/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/svr/icons/apple-touch-icon.png">
  <meta name="theme-color" content="#FAF8F5" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#211D1B" media="(prefers-color-scheme: dark)">
</head>
<body class="svr-root">
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

In the app's main CSS file (imported from `main.tsx`):

```css
@layer theme, base, svr, components, utilities;   /* allowed before @import; repeats the order for safety */
@import "tailwindcss";                             /* Tailwind apps only */
@import "../vendor/svr_brand/dist/storyville.css";
@import "../vendor/svr_brand/dist/tailwind-bridge.css"; /* Tailwind v4 apps only */
```

The CSS paths are relative to that CSS file. A client-side SPA has no hydration step, so it doesn't need `suppressHydrationWarning`.

### TanStack Start (or any framework that renders `<html>` from a route)

There's no `index.html`, so the root route renders the document. Put the layer statement and `theme.js` directly in the `<head>` you render, **above** `<HeadContent />`, so they come before any stylesheet link:

```tsx
// src/routes/__root.tsx
import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import appCss from '../styles/app.css?url'; // app.css @imports storyville.css (and the bridge), as above

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#FAF8F5', media: '(prefers-color-scheme: light)' },
      { name: 'theme-color', content: '#211D1B', media: '(prefers-color-scheme: dark)' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/svr/icons/favicon.ico', sizes: '48x48' },
      { rel: 'icon', href: '/svr/icons/favicon.svg', type: 'image/svg+xml' },
      { rel: 'apple-touch-icon', href: '/svr/icons/apple-touch-icon.png' },
    ],
  }),
  component: () => <Outlet />,
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{'@layer theme, base, svr, components, utilities;'}</style>
        <script src="/svr/js/theme.js" />
        <HeadContent />
      </head>
      <body className="svr-root">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
```

`theme.js` must be a plain `<script src>` with no `async`, `defer` or `type="module"`. Don't move it into `head().scripts` unless you've confirmed your version renders it as a blocking tag before the stylesheet.

### Next.js (App Router)

In `app/layout.tsx`:

- `import '../vendor/svr_brand/dist/storyville.css'` (or `@import` it from `globals.css`).
- `<html lang="en" suppressHydrationWarning>`.
- In `<head>`, first `<style>{'@layer theme, base, svr, components, utilities;'}</style>`, then `<script src="/svr/js/theme.js" />`.
- Next may warn about a synchronous script; that's intended here.
- Put the icons in `metadata.icons`, pointing at `/svr/icons/…`.

## 4. Always-light pages (client-facing, print, PDF)

Some pages must stay light whatever the viewer's setting: client proposal pages (Proposal Lab's `/p/*`), print views and pages rendered to PDF.

- **A whole page:** render `<html data-theme="light" data-svr-pinned>` on the server. `data-theme="light"` makes the CSS light from the first byte, even on a dark-mode computer and even before `theme.js` runs or with JavaScript off. `data-svr-pinned` tells `theme.js` to leave it alone, and `ThemeToggle` renders nothing there.
- **Part of a page** (a client preview inside the staff app): put `data-theme="light"` on the server-rendered wrapper element. Everything inside is light, including inverse bands, while the rest of the app follows the toggle.
- Always set the attribute in the server-rendered HTML, not from a script after load. The device-setting fallback applies until something says otherwise, so a dark-mode client would otherwise see a flash of dark.
- Printing is always light anyway.

## 5. Tailwind v4 apps (including shadcn/ui and Lovable apps on Tailwind v4)

Import the bridge after Tailwind, as in section 3. What it does:

- **Utilities:** every brand token becomes a utility, such as `bg-svr-bg`, `text-svr-text-muted`, `border-svr-border-strong`, `bg-svr-danger-subtle`, `font-svr-display`, `rounded-svr-md` and `p-svr-4`.
- **shadcn variables:** it maps `--background`, `--foreground`, `--primary`, `--destructive`, `--border`, `--input`, `--ring`, `--chart-*`, `--sidebar-*` and `--radius` to the brand role tokens. Delete the app's own `:root { --background: … }` and `.dark { … }` blocks: the brand values switch themes on their own.
- **Dark mode:** Tailwind's `dark:` variant follows `data-theme="dark"`. Replace any `.dark` class toggling with `theme.js` and `ThemeToggle`.

**Expect squarer corners.** The bridge sets `--radius` to the brand's 4px (`--svr-radius-md`), so shadcn components go from their 8px default to `rounded-lg` 4px, `rounded-md` 2px and `rounded-sm` 0. That's the brand's nearly-square look, on purpose.

**Tailwind v3 apps** (older shadcn, with `hsl(var(--background))` in `tailwind.config`) can't use the bridge as is, because the brand values are hex colors, not HSL number triplets. Use `storyville.css`, and in `tailwind.config.js` change each color to `'var(--background)'` (without the `hsl()` wrapper), or keep the app on its own palette until it moves to Tailwind v4.

## 6. TypeScript

- `react/Storyville.d.ts` sits beside `Storyville.jsx`, so `import { Button } from '../vendor/svr_brand/react/Storyville'` is fully typed. That holds in `strict` mode, without `allowJs`, and when `include` covers only `src`. The import has no file extension, so TypeScript finds the `.d.ts`.
- It also declares the `window.svrTheme` global and the `svr-themechange` event.
- Apps that don't import the React file can get the same global types by adding `/// <reference path="../vendor/svr_brand/js/theme.d.ts" />` to a `.d.ts` file in `src`.
