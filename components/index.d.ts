import type * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary = red CTA fill; secondary = red outline. Default primary. */
  variant?: 'primary' | 'secondary';
  size?: 'md' | 'sm';
  /** Renders an <a> instead of a <button>. */
  href?: string;
  children?: React.ReactNode;
}
export declare function Button(props: ButtonProps): React.ReactElement;

export interface EyebrowProps { as?: 'span' | 'p' | 'div'; className?: string; children?: React.ReactNode }
export declare function Eyebrow(props: EyebrowProps): React.ReactElement;

export interface SectionHeaderProps {
  /** Section number shown before the title, e.g. "01". */
  number?: string;
  /** Heading level of the title. Default 2. */
  level?: 1 | 2 | 3;
  className?: string;
  children?: React.ReactNode;
}
export declare function SectionHeader(props: SectionHeaderProps): React.ReactElement;

export interface CalloutProps { title?: string; className?: string; children?: React.ReactNode }
export declare function Callout(props: CalloutProps): React.ReactElement;

export interface TableProps {
  columns: React.ReactNode[];
  rows: React.ReactNode[][];
  /** Header row: 'accent' = Storyville Red (default); 'inverse' = charcoal in light mode, off-white in dark mode. 'red' and 'dark' are accepted as old names. */
  header?: 'accent' | 'inverse' | 'red' | 'dark';
  caption?: string;
  className?: string;
}
export declare function Table(props: TableProps): React.ReactElement;

export interface CardProps { eyebrow?: string; title: React.ReactNode; footer?: React.ReactNode; className?: string; children?: React.ReactNode }
export declare function Card(props: CardProps): React.ReactElement;

export interface SurfaceProps {
  /** default = page background; alt = svr-color-surface-alt; inverse = the opposite theme (charcoal band in light mode, off-white band in dark mode); red = Storyville Red in both themes. 'light' and 'dark' are accepted as old names for default and inverse. */
  tone?: 'default' | 'alt' | 'inverse' | 'red' | 'light' | 'dark';
  as?: 'section' | 'div' | 'header' | 'footer';
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
export declare function Surface(props: SurfaceProps): React.ReactElement;

export interface ThemeToggleProps { className?: string }
/** A "Dark mode" toggle button (aria-pressed). Needs js/theme.js in the page head. */
export declare function ThemeToggle(props: ThemeToggleProps): React.ReactElement;
/** React apps (react/Storyville.jsx only): the current theme and a setter. */
export declare function useTheme(): ['light' | 'dark', (theme: 'light' | 'dark' | null) => void];

export interface SvrTheme {
  get(): 'light' | 'dark';
  set(theme: 'light' | 'dark' | null): void;
  toggle(): void;
  /** Forget the saved choice and follow the device setting again. */
  reset(): void;
}

declare global {
  interface Window {
    Storyville: { Button: typeof Button; Eyebrow: typeof Eyebrow; SectionHeader: typeof SectionHeader; Callout: typeof Callout; Table: typeof Table; Card: typeof Card; Surface: typeof Surface; ThemeToggle: typeof ThemeToggle };
    /** From js/theme.js. */
    svrTheme: SvrTheme;
  }
}
