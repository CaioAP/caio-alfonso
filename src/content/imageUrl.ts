import imageUrlBuilder from '@sanity/image-url';
import { sanity, sanityConfigured } from './client';

interface ImageBuilderLike {
  width(w: number): ImageBuilderLike;
  height(h: number): ImageBuilderLike;
  fit(mode: string): ImageBuilderLike;
  url(): string;
}

/** Chainable stand-in used when Sanity is not configured (fixture builds). */
const placeholderBuilder: ImageBuilderLike = {
  width: () => placeholderBuilder,
  height: () => placeholderBuilder,
  fit: () => placeholderBuilder,
  url: () => '/images/placeholder.svg',
};

const builder = sanityConfigured && sanity ? imageUrlBuilder(sanity) : null;

export function urlFor(source: object): ImageBuilderLike {
  if (!builder) return placeholderBuilder;
  return builder.image(source) as unknown as ImageBuilderLike;
}
