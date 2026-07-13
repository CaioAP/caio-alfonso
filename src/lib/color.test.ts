import { describe, expect, it } from 'vitest';
import {
  contrastRatio,
  formatOklch,
  hexToRgb,
  oklchToRgb,
  parseOklch,
  rgbToHex,
  suggestFix,
  wcagRating,
  wcagRatingLarge,
} from './color';

describe('hexToRgb / rgbToHex', () => {
  it('parses 6-digit hex with or without #', () => {
    expect(hexToRgb('#c8553a')).toEqual({ r: 200, g: 85, b: 58 });
    expect(hexToRgb('c8553a')).toEqual({ r: 200, g: 85, b: 58 });
  });
  it('rejects malformed input', () => {
    expect(hexToRgb('#fff')).toBeNull();
    expect(hexToRgb('nope')).toBeNull();
  });
  it('round-trips', () => {
    expect(rgbToHex({ r: 200, g: 85, b: 58 })).toBe('#c8553a');
  });
});

describe('contrastRatio', () => {
  it('black on white is 21:1', () => {
    const ratio = contrastRatio({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 });
    expect(ratio).toBeCloseTo(21, 0);
  });
  it('is symmetric', () => {
    const a = { r: 43, g: 38, b: 32 };
    const b = { r: 245, g: 243, b: 237 };
    expect(contrastRatio(a, b)).toBeCloseTo(contrastRatio(b, a), 10);
  });
  it('ink on paper (light theme tokens) clears AAA', () => {
    const ink = hexToRgb('#2b2620');
    const paper = hexToRgb('#f5f3ed');
    if (!ink || !paper) throw new Error('bad fixture');
    expect(contrastRatio(ink, paper)).toBeGreaterThanOrEqual(7);
  });
});

describe('wcagRating', () => {
  it('rates normal text thresholds', () => {
    expect(wcagRating(7.2)).toBe('AAA');
    expect(wcagRating(4.6)).toBe('AA');
    expect(wcagRating(3.2)).toBe('FAIL');
  });
  it('rates large text thresholds', () => {
    expect(wcagRatingLarge(4.6)).toBe('AAA');
    expect(wcagRatingLarge(3.2)).toBe('AA');
    expect(wcagRatingLarge(2.2)).toBe('FAIL');
  });
});

describe('oklchToRgb', () => {
  it('white and black extremes', () => {
    expect(oklchToRgb({ l: 1, c: 0, h: 0 })).toEqual({ r: 255, g: 255, b: 255 });
    expect(oklchToRgb({ l: 0, c: 0, h: 0 })).toEqual({ r: 0, g: 0, b: 0 });
  });
  it('vermilion token lands near its documented hex', () => {
    const { r, g, b } = oklchToRgb({ l: 0.585, c: 0.165, h: 36 });
    // docs/03 labels the hex values approximate (≈ #c8553a)
    expect(Math.abs(r - 200)).toBeLessThan(20);
    expect(Math.abs(g - 85)).toBeLessThan(20);
    expect(Math.abs(b - 58)).toBeLessThan(20);
  });
});

describe('parseOklch / formatOklch', () => {
  it('parses authored token syntax', () => {
    expect(parseOklch('oklch(0.585 0.165 36)')).toEqual({ l: 0.585, c: 0.165, h: 36 });
  });
  it('rejects non-oklch strings', () => {
    expect(parseOklch('#c8553a')).toBeNull();
  });
  it('formats round-trippably', () => {
    const parsed = parseOklch(formatOklch({ l: 0.585, c: 0.165, h: 36 }));
    expect(parsed).toEqual({ l: 0.585, c: 0.165, h: 36 });
  });
});

describe('suggestFix', () => {
  it('returns a passing color for a failing pair', () => {
    const fg = hexToRgb('#9b9389');
    const bg = hexToRgb('#f5f3ed');
    if (!fg || !bg) throw new Error('bad fixture');
    expect(contrastRatio(fg, bg)).toBeLessThan(4.5);
    const fixed = suggestFix(fg, bg, 4.5);
    expect(fixed).not.toBeNull();
    if (fixed) expect(contrastRatio(fixed, bg)).toBeGreaterThanOrEqual(4.5);
  });
  it('returns input unchanged when it already passes', () => {
    const fg = hexToRgb('#2b2620');
    const bg = hexToRgb('#f5f3ed');
    if (!fg || !bg) throw new Error('bad fixture');
    expect(suggestFix(fg, bg, 4.5)).toEqual(fg);
  });
});
