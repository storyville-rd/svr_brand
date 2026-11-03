// Storyville RD React components (ES module source for React apps: Vite, Next.js).
// Copy this file into your app (e.g. src/brand/Storyville.jsx) and load dist/storyville.css once.
// Mirrors components/storyville.global.js; props are documented in components/index.d.ts and docs/components/.
import React from 'react';

const cx = (...c) => c.filter(Boolean).join(' ');

export function Button({ variant = 'primary', size = 'md', className, href, children, type, ...rest }) {
  const cls = cx('sv-btn', `sv-btn-${variant}`, size === 'sm' && 'sv-btn-sm', className);
  if (href) return <a {...rest} href={href} className={cls}>{children}</a>;
  return <button type={type || 'button'} {...rest} className={cls}>{children}</button>;
}

export function Eyebrow({ as: Tag = 'span', className, children }) {
  return <Tag className={cx('sv-eyebrow', 'eyebrow', className)}>{children}</Tag>;
}

export function SectionHeader({ number, level = 2, className, children }) {
  const H = `h${level}`;
  return (
    <div className={cx('sv-section', className)}>
      {number != null && <span className="sv-section-num subheading-h2" aria-hidden="true">{number}</span>}
      <H className="sv-section-title subheading-h2">{children}</H>
    </div>
  );
}

export function Callout({ title, className, children }) {
  return (
    <aside className={cx('sv-callout', 'body', className)} role="note">
      {title && <span className="sv-callout-title table-header">{title}</span>}
      {typeof children === 'string' ? <p className="body">{children}</p> : children}
    </aside>
  );
}

export function Table({ columns = [], rows = [], header, caption, className }) {
  return (
    <table className={cx('sv-table', header === 'dark' && 'sv-table-dark', className)}>
      {caption && <caption className="caption" style={{ textAlign: 'left', paddingBottom: 'var(--space-2)' }}>{caption}</caption>}
      <thead><tr>{columns.map((c, i) => <th key={i} scope="col" className="table-header">{c}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className="table-body">{c}</td>)}</tr>)}</tbody>
    </table>
  );
}

export function Card({ eyebrow, title, footer, className, children }) {
  return (
    <article className={cx('sv-card', className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h3 className="sv-card-title subheading-h2">{title}</h3>
      {children && <div className="sv-card-body body">{children}</div>}
      {footer && <div className="sv-card-footer">{footer}</div>}
    </article>
  );
}

export function Surface({ tone = 'light', as: Tag = 'section', className, style, children }) {
  return <Tag className={cx('sv-surface', `sv-surface-${tone}`, 'body', className)} style={style}>{children}</Tag>;
}
