# Storyville RD Brand Guidelines

Storyville RD is a Las Vegas video production and communications company. The brand is warm, editorial and confident: tall condensed headlines, a warm off-white page, soft charcoal type and one red that accents rather than dominates. These rules apply to all digital and print materials: web, apps, proposals, decks and documents.

## Voice and content

- Tagline: **Your Path. Your Story.** The logo lockup sets it in caps as "YOUR PATH. YOUR STORY".
- Write about the client's story, not our equipment. Lead with intention and outcome: "From concept to final cut, Storyville RD crafts video content with intention. Documentary, commercial, narrative: every frame in service of the story."
- Headlines are short, active and title case: "We Tell Stories That Move People". Bebas Neue renders them in caps.
- Eyebrows are 2–4 words in uppercase above a headline: "AWARD-WINNING PRODUCTION".
- Speak as "we" to "you". No emoji in brand materials.

## Color

Colors come in two layers.

**The palette** (`--svr-palette-*`) is the brand's fixed colors. They never change with the theme:

| Token | Hex | Name |
| --- | --- | --- |
| `svr-palette-red` | #A72F2F | Storyville Red |
| `svr-palette-offwhite` | #FAF8F5 | Off-White (Natural Warm) |
| `svr-palette-charcoal` | #211D1B | Soft Charcoal |
| `svr-palette-muted` | #D4CECC | Muted Off-White |
| `svr-palette-gray` | #F0EDE8 | Surface Gray |
| `svr-palette-border` | #C8C4C0 | Border Gray |
| `svr-palette-red-light` | #E07B72 | Red tint for dark mode (added for dark mode) |
| `svr-palette-charcoal-alt` | #2E2926 | Raised charcoal (added for dark mode) |
| `svr-palette-border-dark` | #6B625D | Dark-mode border (added for dark mode) |

**The role tokens** (`--svr-color-*`) are what apps and components use. Each one switches value between light and dark mode, so app CSS never has to mention the theme:

| Token | Light | Dark | Use for |
| --- | --- | --- | --- |
| `svr-color-bg` | Off-White | Soft Charcoal | Page and screen background |
| `svr-color-text` | Soft Charcoal | Muted Off-White | Body copy |
| `svr-color-heading` | Soft Charcoal | Off-White | Charcoal/off-white headings, labels, card and section titles, focus rings |
| `svr-color-surface-alt` | Surface Gray | Raised charcoal | Alternating table rows, callout fills |
| `svr-color-border` | Border Gray | Dark-mode border | Dividers, table borders (decorative only) |
| `svr-color-accent` | Storyville Red | Red tint #E07B72 | Red text and rules: Bebas headlines, eyebrows, links, error text, accent rules, outline buttons, callout borders |
| `svr-color-accent-fill` | Storyville Red | Storyville Red | Red fills: primary buttons, table header rows |
| `svr-color-on-accent` | Off-White | Off-White | Text on `svr-color-accent-fill` |

- Style apps with the role tokens only. Use a palette token directly only for something that must look the same in both themes.
- **Off-White replaces pure #FFFFFF and Soft Charcoal replaces pure #000000, everywhere.** Never use either pure value as a background or as text.
- In dark mode, body copy is Muted Off-White, not full Off-White; the step down reduces halation on long reads. Headings and short labels stay full Off-White.
- Red accents, it doesn't dominate: don't use `svr-color-accent-fill` as a large fill except for one closing call-to-action band.
- Never mix warm and cool whites in one layout (e.g. #FAF8F5 with #F5F5F3).
- The true Storyville Red (#A72F2F) is only 2.5:1 on charcoal, so it never appears as text in dark mode; `svr-color-accent` switches to the #E07B72 tint there. Red *fills* keep the true red in both themes.

### Approved pairings (WCAG 2.1)

| Text | Background | Light | Dark |
| --- | --- | --- | --- |
| `svr-color-text` | `svr-color-bg` | 15.8:1 (AAA) | 10.7:1 (AAA) |
| `svr-color-heading` | `svr-color-bg` | 15.8:1 (AAA) | 15.8:1 (AAA) |
| `svr-color-text` | `svr-color-surface-alt` | 14.3:1 (AAA) | 9.2:1 (AAA) |
| `svr-color-accent` | `svr-color-bg` | 6.4:1 (AA) | 5.8:1 (AA) |
| `svr-color-accent` | `svr-color-surface-alt` | 5.8:1 (AA) | 5.0:1 (AA) |
| `svr-color-on-accent` | `svr-color-accent-fill` | 6.4:1 (AA) | 6.4:1 (AA) |

These are the only approved text pairings.

## Light and dark mode

Every Storyville app supports both themes and has a visible light/dark toggle.

- The theme lives on the page's `<html>` element: `data-theme="dark"` or `data-theme="light"`. With no attribute, the page follows the device's setting.
- Each app starts in the device setting. Once someone uses the toggle, their choice is remembered for that app (the `svr-theme` key in the browser's storage).
- Put the toggle somewhere it can always be reached, such as the app header or the settings menu. It's a button labeled "Dark mode" that reports its state to screen readers (`aria-pressed`). Use the `ThemeToggle` component.
- Never hard-code a color, or a light/dark pair of colors, in app CSS. Use the role tokens and the theme takes care of itself.
- Check both themes before shipping: every screen, every state.
- Logos switch too: charcoal versions in light mode, off-white versions in dark mode.

## Typography

Two typefaces, both open-licensed (SIL Open Font License) and bundled with the system as WOFF2 files: never load them from Google Fonts or another outside service.

- **Bebas Neue** (`--svr-font-display`) for all display and heading roles: `svr-display-h1` (Display/H1, 36–48pt, 48–64px on screen) and `svr-subheading-h2` (sub-sections, card headers, 24–30pt, 32–40px). Bebas Neue is display only: never use it for body copy or captions.
- **Source Sans 3** (`--svr-font-body`) for everything else: `svr-eyebrow` (bold, uppercase, tracked), `svr-body` (all running copy, 10–11pt), `svr-caption` (captions and fine print, 8–9pt), `svr-table-header` (10pt bold, `svr-color-on-accent` on `svr-color-accent-fill`) and `svr-table-body` (10pt). Never use it for hero headlines.
- Bebas headlines are `svr-color-accent`; section and card titles are `svr-color-heading`.
- Where fonts can't be embedded (e.g. Word, Outlook), fall back to **Arial Bold** for headings and **Calibri** for body.
- Print sizes are in points; screen sizes convert at 1pt ≈ 1.33px.

## Layout, spacing and shape

- Spacing follows the `svr-space-*` scale (4, 8, 12, 16, 24, 32, 48px). Pad cards with `svr-space-6`, separate sections with `svr-space-8`, and pad full-width bands with `svr-space-12`.
- Shapes are nearly square, echoing the rectangular mark: `svr-radius-sm` (2px) on buttons, `svr-radius-md` (4px) on cards and callouts, `svr-radius-none` on tables and bands.
- Structure comes from rules, not shadows: a `svr-rule-accent` (3px, `svr-color-accent`) under section headers and across the top of cards, and `svr-rule-hairline` (1px) dividers in `svr-color-border`. No drop shadows or gradients.
- Focus rings are a solid 2px `svr-color-heading` outline, offset 2px. That's charcoal in light mode and off-white in dark mode.

## Logo

Use the files in [`logos/`](../logos/). Never use live type or a redrawing. Use the charcoal version on light grounds (light mode, `svr-color-surface-alt`) and the off-white version on dark and red grounds (dark mode, inverse bands, red bands). The stacked logo (mark, wordmark and tagline) is the primary lockup; the horizontal logo (mark beside the wordmark) suits headers, letterhead and email signatures; the wordmark alone suits tight spaces; the S-road mark alone suits favicons and avatars. Alt text for each logo is in [ACCESSIBILITY.md](ACCESSIBILITY.md#logos).

## Iconography and imagery

The guidelines define no icon set. If a layout needs icons, use simple line icons in `svr-color-heading` or `svr-color-accent`; never emoji. Let photography and video stills carry the imagery, with captions in `svr-caption`.

## Components

See [the component docs](components/). `Button` (CTA), `Eyebrow`, `SectionHeader`, `Callout`, `Table`, `Card`, `Surface` and `ThemeToggle` implement these rules, in both themes. A `Surface` band re-points the role tokens, so whatever sits inside it re-colors itself:

- `default`: the page background.
- `alt`: Surface Gray in light mode, raised charcoal in dark mode.
- `inverse`: the opposite theme, so a charcoal band in light mode and an off-white band in dark mode.
- `red`: Storyville Red in both themes.

Keyboard behavior for each component is in [ACCESSIBILITY.md](ACCESSIBILITY.md#by-component).

## Code conventions

- **Prefix:** everything the system defines starts with `svr-`. That covers classes (`svr-btn`, `svr-surface-inverse`, `svr-display-h1`…) and CSS variables (`--svr-color-accent`, `--svr-space-4`, `--svr-font-display`…), so nothing collides with an app's own CSS. Never give an app's own classes the `svr-` prefix. Apps may name their own Storyville-wide variables `--svr-…` (like `--svr-banner-height`), but never in the reserved families `--svr-color-*`, `--svr-palette-*`, `--svr-space-*`, `--svr-radius-*`, `--svr-rule-*` and `--svr-font-*`.
- **Cascade layer:** all of the system's CSS (tokens, type styles, components) sits in the `svr` cascade layer. An app sets the layer order once, before any stylesheet loads, so brand styles sit above its resets and below its utilities and local overrides. For a Tailwind app: `@layer theme, base, svr, components, utilities;`. CSS written outside any layer overrides every layer, brand styles included.

## Accessibility

Every app, page and document meets WCAG 2.2 AA in both themes. [ACCESSIBILITY.md](ACCESSIBILITY.md) covers alt text (logos use the text they contain), keyboard behavior, the shared keyboard shortcuts, motion and video captions, and forms.

## Do / don't

| Do | Don't |
| --- | --- |
| Use `svr-color-bg` (Off-White in light mode) for every page background. | Use pure #FFFFFF as a page or screen background. It's too harsh against the warm red. |
| Use `svr-color-text` for body copy. | Use pure #000000 for text. It creates excessive halation and contradicts the warm palette. |
| Let body copy step down to Muted Off-White in dark mode (`svr-color-text` does this). | Use full Off-White for long body copy on dark surfaces. It causes eye fatigue at reading size. |
| Style with the role tokens so both themes work. | Hard-code hex values, or write separate light and dark rules, in app CSS. |
| Use Bebas Neue for all H1–H2 headings across print and digital. | Use Bebas Neue for body copy or captions. It's a display face only. |
| Use Source Sans 3 for all body, UI labels, captions and table content. | Use Source Sans 3 for hero headlines. That's Bebas Neue's job. |
| Use `svr-color-accent` for red text and rules, and `svr-color-accent-fill` for CTAs and table header rows. | Overuse red as a fill. It should accent, not dominate. |
| Mix warm whites only. | Mix warm and cool white/off-white values in the same layout. |

Questions or exceptions: contact Carissa (Creative Operations) before deviating from these guidelines.
