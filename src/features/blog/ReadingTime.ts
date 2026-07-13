interface PortableSpan {
  text?: string;
}
interface PortableBlock {
  _type?: string;
  children?: PortableSpan[];
}

export function readingTime(body: unknown[]): number {
  const text = body
    .filter((b): b is PortableBlock => {
      const block = b as PortableBlock;
      return block._type === 'block' && Array.isArray(block.children);
    })
    .flatMap((b) => (b.children ?? []).map((c) => c.text ?? ''))
    .join(' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
