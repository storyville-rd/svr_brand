# Installing svr_brand in an app

There are two ways to use the brand in an app:

- **CDN:** the app links the files from jsDelivr (see the README). This is simplest, and fine for plain pages and apps that don't use Tailwind.
- **Install (vendor):** the app keeps its own copy of a release. This is required for `dist/tailwind-bridge.css`, which Tailwind has to process at build time. It also works offline and doesn't depend on the CDN.

## Install a release

1. Download the release you want from GitHub (Releases, then the tag such as `v3.1.0`, then "Source code"), or let your sync script fetch it.
2. Copy these folders and files into the app at `vendor/svr_brand/`, or `public/vendor/svr_brand/` for files the browser loads directly:

   ```
   VERSION
   manifest.json
   dist/          storyville.css, tailwind-bridge.css
   fonts/         the WOFF2 files, fonts.css and the licenses
   js/            theme.js
   icons/         favicons
   logos/         logo PNGs
   react/         Storyville.jsx (React apps)
   components/    storyville.global.js, index.d.ts
   ```

3. **Keep this folder layout.** `dist/storyville.css` loads its fonts from `../fonts/`, so the two folders must stay side by side.
4. **Never edit these files in the app.** Change the brand in the svr_brand repo and install the new release. Edits made in an app are lost at the next update, and that app drifts from the brand.
5. Check the copy against `manifest.json`. It lists every file in the release with its size and SHA-256 hash, so a sync script can confirm nothing is missing, extra or corrupted. The release's commit comes from its GitHub tag; the manifest doesn't record it, because a file can't contain the hash of its own commit.

## Wire it up

The `<head>` order matters. The layer statement comes first, then the theme script, then the stylesheet:

```html
<style>@layer theme, base, svr, components, utilities;</style>
<script src="/vendor/svr_brand/js/theme.js"></script>
<link rel="stylesheet" href="/vendor/svr_brand/dist/storyville.css">
<link rel="icon" href="/vendor/svr_brand/icons/favicon.ico" sizes="48x48">
<link rel="icon" href="/vendor/svr_brand/icons/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/vendor/svr_brand/icons/apple-touch-icon.png">
<meta name="theme-color" content="#FAF8F5" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#211D1B" media="(prefers-color-scheme: dark)">
```

### Tailwind v4 apps (including shadcn/ui and Lovable apps on Tailwind v4)

In the app's main CSS file:

```css
@layer theme, base, svr, components, utilities;
@import "tailwindcss";
@import "../vendor/svr_brand/dist/storyville.css";
@import "../vendor/svr_brand/dist/tailwind-bridge.css";
```

What the bridge does:

- **Utilities:** every brand token becomes a utility, such as `bg-svr-bg`, `text-svr-text-muted`, `border-svr-border-strong`, `bg-svr-danger-subtle`, `font-svr-display`, `rounded-svr-md` and `p-svr-4`.
- **shadcn variables:** it maps `--background`, `--foreground`, `--primary`, `--destructive`, `--border`, `--input`, `--ring`, `--chart-*`, `--sidebar-*` and `--radius` to the brand's role tokens. Delete the app's own `:root { --background: … }` and `.dark { … }` blocks: the brand values switch themes on their own.
- **Dark mode:** Tailwind's `dark:` variant follows `data-theme="dark"`. Replace any `.dark` class toggling with `js/theme.js` and the `ThemeToggle` component.

**Tailwind v3 apps** (older shadcn, with `hsl(var(--background))` in `tailwind.config`) can't use the bridge as is, because the brand values are hex colors, not HSL number triplets. Use `storyville.css`, and in `tailwind.config.js` change each color to `'var(--background)'` (without the `hsl()` wrapper), or keep the app on its own palette until it moves to Tailwind v4.

### React apps

Import components from `vendor/svr_brand/react/Storyville.jsx`. You can import it in place; there's no need to copy it elsewhere.
