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
  /** Header row fill: red (default) or dark charcoal. */
  header?: 'red' | 'dark';
  caption?: string;
  className?: string;
}
export declare function Table(props: TableProps): React.ReactElement;

export interface CardProps { eyebrow?: string; title: React.ReactNode; footer?: React.ReactNode; className?: string; children?: React.ReactNode }
export declare function Card(props: CardProps): React.ReactElement;

export interface SurfaceProps {
  /** light = Off-White, alt = Surface Gray, dark = Soft Charcoal, red = Storyville Red. */
  tone?: 'light' | 'alt' | 'dark' | 'red';
  as?: 'section' | 'div' | 'header' | 'footer';
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
export declare function Surface(props: SurfaceProps): React.ReactElement;

declare global {
  interface Window {
    Storyville: { Button: typeof Button; Eyebrow: typeof Eyebrow; SectionHeader: typeof SectionHeader; Callout: typeof Callout; Table: typeof Table; Card: typeof Card; Surface: typeof Surface };
  }
}
