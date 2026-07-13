import { describe, expect, it } from 'vitest';
import { readingTime } from './ReadingTime';

function block(text: string) {
  return {
    _type: 'block',
    children: [{ _type: 'span', text }],
  };
}

describe('readingTime', () => {
  it('never returns 0', () => {
    expect(readingTime([])).toBe(1);
    expect(readingTime([block('short')])).toBe(1);
  });
  it('counts ~200 words per minute', () => {
    const words = Array.from({ length: 450 }, (_, i) => `word${i}`).join(' ');
    expect(readingTime([block(words)])).toBe(3);
  });
  it('ignores non-block entries (images, code)', () => {
    expect(readingTime([{ _type: 'image' }, block('hello world')])).toBe(1);
  });
});
