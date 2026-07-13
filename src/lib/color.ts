/**
 * Framework-agnostic color math: OKLCH → sRGB, WCAG relative luminance,
 * contrast ratios, and ratings. Shared by the Contrast Checker (Vue) and
 * Token Studio (React) islands.
 */

export interface Rgb {
  r: number; // 0–255
  g: number;
  b: number;
}

export interface Oklch {
  l: number; // 0–1
  c: number; // 0–~0.4
  h: number; // 0–360
}

/** OKLCH → sRGB via OKLab → LMS → linear sRGB (CSS Color 4 math). */
export function oklchToRgb({ l, c, h }: Oklch): Rgb {
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;

  const lr = 4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_;
  const lg = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_;
  const lb = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_;

  const gamma = (x: number) => {
    const v = Math.min(1, Math.max(0, x));
    return v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
  };
  return {
    r: Math.round(gamma(lr) * 255),
    g: Math.round(gamma(lg) * 255),
    b: Math.round(gamma(lb) * 255),
  };
}

/** Parses `oklch(0.585 0.165 36)` (as authored in the token CSS). */
export function parseOklch(value: string): Oklch | null {
  const m = value.trim().match(/^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)$/);
  if (!m) return null;
  return { l: Number(m[1]), c: Number(m[2]), h: Number(m[3]) };
}

export function formatOklch({ l, c, h }: Oklch): string {
  return `oklch(${round3(l)} ${round3(c)} ${round1(h)})`;
}

const round3 = (n: number) => Math.round(n * 1000) / 1000;
const round1 = (n: number) => Math.round(n * 10) / 10;

export function hexToRgb(hex: string): Rgb | null {
  const m = hex.trim().match(/^#?([0-9a-f]{6})$/i);
  if (!m) return null;
  const n = Number.parseInt(m[1] as string, 16);
  return { r: (n >> 16) & 0xff, g: (n >> 8) & 0xff, b: n & 0xff };
}

export function rgbToHex({ r, g, b }: Rgb): string {
  const to2 = (n: number) => n.toString(16).padStart(2, '0');
  return `#${to2(r)}${to2(g)}${to2(b)}`;
}

/** WCAG 2.x relative luminance of an sRGB color. */
export function relativeLuminance({ r, g, b }: Rgb): number {
  const lin = (v: number) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** WCAG contrast ratio between two sRGB colors (1–21). */
export function contrastRatio(a: Rgb, b: Rgb): number {
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  const [hi, lo] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

export type WcagRating = 'FAIL' | 'AA' | 'AAA';

/** Rating for normal-size text: AA ≥ 4.5, AAA ≥ 7. */
export function wcagRating(ratio: number): WcagRating {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  return 'FAIL';
}

/** Rating for large text (≥ 18pt / 14pt bold): AA ≥ 3, AAA ≥ 4.5. */
export function wcagRatingLarge(ratio: number): WcagRating {
  if (ratio >= 4.5) return 'AAA';
  if (ratio >= 3) return 'AA';
  return 'FAIL';
}

/**
 * Suggests a passing foreground: walks the foreground's lightness away from
 * the background until the ratio clears the target. Returns null if even
 * pure black/white cannot pass (shouldn't happen for target ≤ 21).
 */
export function suggestFix(fg: Rgb, bg: Rgb, target = 4.5): Rgb | null {
  const darkenTowards = relativeLuminance(bg) >= 0.5;
  const step = darkenTowards ? -5 : 5;
  const candidate: Rgb = { ...fg };
  for (let i = 0; i < 52; i++) {
    if (contrastRatio(candidate, bg) >= target) return candidate;
    candidate.r = Math.min(255, Math.max(0, candidate.r + step));
    candidate.g = Math.min(255, Math.max(0, candidate.g + step));
    candidate.b = Math.min(255, Math.max(0, candidate.b + step));
  }
  return contrastRatio(candidate, bg) >= target ? candidate : null;
}
