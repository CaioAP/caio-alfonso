/**
 * Accent presets for the site-wide color picker. The single source of truth
 * shared by the pre-paint inline script (BaseLayout) and the AccentPicker UI.
 *
 * Each preset drives `--shu` / `--shu-strong` and, in dark mode, tints the
 * neutral surfaces toward the accent hue (`ph`). Light mode keeps the default
 * washi neutrals from global.css. Mirrors the design prototype's token demo.
 */
export interface Accent {
  id: string;
  label: string;
  /** Light-mode OKLCH for --shu. */
  l: number;
  c: number;
  h: number;
  /** Dark-mode lightness for --shu (chroma/hue reused from light). */
  dl: number;
  /** Dark-mode hue for the tinted paper/surface/line neutrals. */
  ph: number;
}

export const ACCENT_LIST: Accent[] = [
  { id: 'vermilion', label: 'Vermilion', l: 0.585, c: 0.165, h: 36, dl: 0.66, ph: 55 },
  { id: 'indigo', label: 'Indigo', l: 0.42, c: 0.09, h: 252, dl: 0.62, ph: 240 },
  { id: 'moss', label: 'Moss', l: 0.45, c: 0.06, h: 150, dl: 0.62, ph: 145 },
];

export const DEFAULT_ACCENT = 'vermilion';

export const ACCENTS: Record<string, Accent> = Object.fromEntries(
  ACCENT_LIST.map((a) => [a.id, a]),
);
