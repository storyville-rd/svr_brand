# Button

The call to action: Storyville Red fill (primary) or red outline (secondary), set in uppercase bold Source Sans 3.

**Provide:** `children` (a short verb phrase), optional `variant` (`primary` | `secondary`), `size` (`md` | `sm`), `href` to render a link, plus any native button props (`onClick`, `disabled`, `type`).

- Use one primary Button per view; pair it with a secondary for the alternative path.
- Primary hovers to `color-bg-dark`; secondary fills with `color-accent` on hover.
- Inside a `Surface` with `tone="red"` the primary inverts to an Off-White fill with red text, so it never disappears into the band.
- Labels are verbs: "Start your project", "View our work". No "Click here".
- Don't stack several red buttons in a row: red accents, it doesn't dominate.
