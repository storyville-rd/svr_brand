# Table

A data table with a reversed header row (Storyville Red by default, or Soft Charcoal) and alternating Off-White / Surface Gray body rows.

**Provide:** `columns` (header labels), `rows` (array of row arrays), optional `header` (`red` | `dark`), optional `caption`.

- Header text is `table-header` in `color-text-reversed`; body is `table-body` in `color-text-primary`.
- Rows alternate `color-bg-light` and `color-surface-alt`; borders are `color-border`.
- Use the `dark` header when a page already carries a lot of red.
- Never use pure white rows.
