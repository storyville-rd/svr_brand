'use client';
// Storyville RD React components (ES module source for React apps: Vite, Next.js).
// Copy this file into your app (e.g. src/brand/Storyville.jsx). Load js/theme.js and dist/storyville.css once per app.
// Mirrors components/storyville.global.js; props are documented in components/index.d.ts and docs/components/.
import React from 'react';

const cx = (...c) => c.filter(Boolean).join(' ');
const SURFACE = { default: '', light: '', alt: 'svr-surface-alt', inverse: 'svr-surface-inverse', dark: 'svr-surface-inverse', red: 'svr-surface-red' };

export function Button({ variant = 'primary', size = 'md', className, href, children, type, ...rest }) {
  const cls = cx('svr-btn', `svr-btn-${variant}`, size === 'sm' && 'svr-btn-sm', className);
  if (href) return <a {...rest} href={href} className={cls}>{children}</a>;
  return <button type={type || 'button'} {...rest} className={cls}>{children}</button>;
}

export function Eyebrow({ as: Tag = 'span', className, children }) {
  return <Tag className={cx('svr-eyebrow', className)}>{children}</Tag>;
}

export function SectionHeader({ number, level = 2, className, children }) {
  const H = `h${level}`;
  return (
    <div className={cx('svr-section', className)}>
      {number != null && <span className="svr-section-num svr-subheading-h2" aria-hidden="true">{number}</span>}
      <H className="svr-section-title svr-subheading-h2">{children}</H>
    </div>
  );
}

export function Callout({ title, className, children }) {
  return (
    <aside className={cx('svr-callout', 'svr-body', className)} role="note">
      {title && <span className="svr-callout-title svr-table-header">{title}</span>}
      {typeof children === 'string' ? <p className="svr-body">{children}</p> : children}
    </aside>
  );
}

export function Table({ columns = [], rows = [], header = 'accent', caption, className }) {
  const inverse = header === 'inverse' || header === 'dark';
  return (
    <table className={cx('svr-table', inverse && 'svr-table-inverse', className)}>
      {caption && <caption className="svr-caption" style={{ textAlign: 'left', paddingBottom: 'var(--svr-space-2)' }}>{caption}</caption>}
      <thead><tr>{columns.map((c, i) => <th key={i} scope="col" className="svr-table-header">{c}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className="svr-table-body">{c}</td>)}</tr>)}</tbody>
    </table>
  );
}

export function Card({ eyebrow, title, footer, className, children }) {
  return (
    <article className={cx('svr-card', className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h3 className="svr-card-title svr-subheading-h2">{title}</h3>
      {children && <div className="svr-card-body svr-body">{children}</div>}
      {footer && <div className="svr-card-footer">{footer}</div>}
    </article>
  );
}

export function Surface({ tone = 'default', as: Tag = 'section', className, style, children }) {
  return <Tag className={cx('svr-surface', SURFACE[tone], 'svr-body', className)} style={style}>{children}</Tag>;
}

// Light/dark mode. Needs js/theme.js loaded in the page <head> (it defines window.svrTheme).
export function useTheme() {
  const [theme, setThemeState] = React.useState('light');
  React.useEffect(() => {
    if (window.svrTheme) setThemeState(window.svrTheme.get());
    const on = (e) => setThemeState(e.detail.theme);
    window.addEventListener('svr-themechange', on);
    return () => window.removeEventListener('svr-themechange', on);
  }, []);
  const setTheme = (t) => window.svrTheme && window.svrTheme.set(t);
  return [theme, setTheme];
}

export function ThemeToggle({ className }) {
  const [theme] = useTheme();
  const dark = theme === 'dark';
  return (
    <button type="button" className={cx('svr-btn', 'svr-btn-sm', 'svr-theme-toggle', className)} aria-pressed={dark}
      onClick={() => window.svrTheme && window.svrTheme.toggle()}>
      Dark mode<span aria-hidden="true">{dark ? ': On' : ': Off'}</span>
    </button>
  );
}
