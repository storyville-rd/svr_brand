# Storyville RD Brand Guidelines

Storyville RD is a Las Vegas video production and communications company. The brand is warm, editorial and confident: tall condensed headlines, a warm off-white page, soft charcoal type and one red that accents rather than dominates. These rules apply to all digital and print materials: web, apps, proposals, decks and documents.

## Voice and content

- Tagline: **Your Path. Your Story.** The logo lockup sets it in caps as "YOUR PATH. YOUR STORY".
- Write about the client's story, not our equipment. Lead with intention and outcome: "From concept to final cut, Storyville RD crafts video content with intention. Documentary, commercial, narrative: every frame in service of the story."
- Headlines are short, active and title case: "We Tell Stories That Move People". Bebas Neue renders them in caps.
- Eyebrows are 2–4 words in uppercase above a headline: "AWARD-WINNING PRODUCTION".
- Speak as "we" to "you". No emoji in brand materials.

## Color

Use the eight tokens exactly; there are no tints or extra shades.

- **`color-bg-light` (#FAF8F5)** is the default surface for every light page, screen, proposal and print document. Never use pure #FFFFFF as a background.
- **`color-text-primary` (#211D1B)** for all body text on light surfaces. Never use pure #000000 for text.
- **`color-accent` (#A72F2F, Storyville Red)** for headlines, accent rules, CTAs, callout borders and table header rows. Red should accent, not dominate: don't use it as a large fill except for one closing call-to-action band.
- **`color-surface-alt` (#F0EDE8)** for alternating table rows and callout fills. **`color-border` (#C8C4C0)** for table borders, dividers and subtle rules.
- **`color-bg-dark` (#211D1B)** for reversed sections. On it, set headlines and short labels in **`color-text-reversed` (#FAF8F5)** and body paragraphs in **`color-text-body-dark` (#D4CECC)**; the step down reduces halation on long reads.
- Never mix warm and cool whites in one layout (e.g. #FAF8F5 with #F5F5F3).

### The Off-White Rule

#FAF8F5 plays two roles. As a **background**, it's the primary light-mode surface everywhere. As **reversed text**, it's the foreground on `color-bg-dark` and `color-accent`. Use it for headlines on dark; step body copy down to #D4CECC.

### Approved pairings (WCAG 2.1)

| Text | Background | Contrast | Use for |
| --- | --- | --- | --- |
| `color-text-primary` #211D1B | `color-bg-light` #FAF8F5 | 15.8:1 (AAA) | Body copy, headings |
| `color-text-reversed` #FAF8F5 | `color-bg-dark` #211D1B | 15.8:1 (AAA) | Headlines, labels on dark |
| `color-text-body-dark` #D4CECC | `color-bg-dark` #211D1B | 10.7:1 (AAA) | Body copy on dark |
| `color-text-reversed` #FAF8F5 | `color-accent` #A72F2F | 6.4:1 (AA) | Buttons, table headers, red bands |
| `color-accent` #A72F2F | `color-bg-light` #FAF8F5 | 6.4:1 (AA) | Headlines, eyebrows, links |
| `color-text-primary` #211D1B | `color-surface-alt` #F0EDE8 | 14.3:1 (AAA) | Table rows, callouts |

These are the only approved text pairings. **Never set red text on `color-bg-dark`** (2.5:1, fails). On dark, eyebrows and accents switch to `color-text-reversed`.

## Typography

Two typefaces, both from Google Fonts (open license); embed them in digital products.

- **Bebas Neue** (`--font-display`) for all display and heading roles: `display-h1` (Display/H1, 36–48pt, 48–64px on screen) and `subheading-h2` (sub-sections, card headers, 24–30pt, 32–40px). Bebas Neue is display only: never use it for body copy or captions.
- **Source Sans 3** (`--font-body`) for everything else: `eyebrow` (bold, uppercase, tracked), `body` (all running copy, 10–11pt), `caption` (captions and fine print, 8–9pt), `table-header` (10pt bold, reversed on red or dark) and `table-body` (10pt). Never use it for hero headlines.
- Headings are `color-accent` on light grounds and `color-text-reversed` on dark or red.
- Where fonts can't be embedded (e.g. Word, Outlook), fall back to **Arial Bold** for headings and **Calibri** for body.
- Print sizes are in points; screen sizes convert at 1pt ≈ 1.33px.

## Layout, spacing and shape

- Spacing follows the `space-*` scale (4, 8, 12, 16, 24, 32, 48px). Pad cards with `space-6`, separate sections with `space-8`, and pad full-width bands with `space-12`.
- Shapes are nearly square, echoing the rectangular mark: `radius-sm` (2px) on buttons, `radius-md` (4px) on cards and callouts, `radius-none` on tables and bands.
- Structure comes from rules, not shadows: a `rule-accent` (3px red) under section headers and across the top of cards, `rule-hairline` (1px) `color-border` dividers. No drop shadows or gradients.
- Focus rings are a solid 2px `color-text-primary` outline (`color-text-reversed` on dark and red), offset 2px.

## Logo

Use the files in [`logos/`](../logos/), never live type or a redrawing. Use the charcoal version on `color-bg-light` and `color-surface-alt`, and the off-white version on `color-bg-dark` and `color-accent`. The stacked logo (mark, wordmark and tagline) is the primary lockup; the horizontal logo (mark beside the wordmark) suits headers, letterhead and email signatures; the wordmark alone suits tight spaces; the S-road mark alone suits favicons and avatars.

## Iconography and imagery

The guidelines define no icon set. If a layout needs icons, use simple line icons in `color-text-primary` or `color-accent`; never emoji. Let photography and video stills carry the imagery, with captions in `caption`.

## Components

See [the component docs](components/). `Button` (CTA), `Eyebrow`, `SectionHeader`, `Callout`, `Table`, `Card` and `Surface` (light, alt, dark and red bands) implement these rules. Wrap reversed content in a `Surface` with `tone="dark"` or `tone="red"` and children re-color automatically.

## Do / don't

| Do | Don't |
| --- | --- |
| Use #FAF8F5 as the default background for all light-mode surfaces. | Use pure #FFFFFF as a page or screen background. It's too harsh against the warm red. |
| Use #211D1B for all body text on light surfaces. | Use pure #000000 for text. It creates excessive halation and contradicts the warm palette. |
| Step down to #D4CECC for body paragraphs on dark backgrounds. | Use full #FAF8F5 for long body copy on dark surfaces. It causes eye fatigue at reading size. |
| Use #FAF8F5 for reversed headlines and short labels on dark/red backgrounds. | Mix warm and cool white/off-white values in the same layout. |
| Use Bebas Neue for all H1–H2 headings across print and digital. | Use Bebas Neue for body copy or captions. It's a display face only. |
| Use Source Sans 3 for all body, UI labels, captions and table content. | Use Source Sans 3 for hero headlines. That's Bebas Neue's job. |
| Use #A72F2F for accent elements, CTAs, callout borders and table header rows. | Overuse red as a fill. It should accent, not dominate. |

Questions or exceptions: contact Carissa (Creative Operations) before deviating from these guidelines.
