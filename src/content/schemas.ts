import type { ArbitraryTypedObject } from '@portabletext/types';
import { z } from 'zod';

/**
 * A GROQ projection returns `null` for a field the document leaves unset, but
 * Zod's `.optional()` and `.default()` only admit `undefined`. Any field that
 * can arrive through a projection therefore has to tolerate null explicitly.
 *
 * Required fields deliberately stay strict: missing content should fail the
 * build loudly rather than render as a hole in the page.
 */
function optional<T extends z.ZodTypeAny>(schema: T) {
  return schema.nullish().transform((v) => v ?? undefined);
}

/** As `optional`, but substitutes a fallback. Takes a factory so callers never share one array. */
function withDefault<T extends z.ZodTypeAny>(schema: T, fallback: () => z.output<T>) {
  return schema.nullish().transform((v) => v ?? fallback());
}

/**
 * Portable Text bodies are structurally validated by Sanity itself; here we
 * only assert "array of typed objects" so the renderer's types line up.
 */
const portableTextSchema = z.array(
  z.custom<ArbitraryTypedObject>((v) => typeof v === 'object' && v !== null),
);

const imageSchema = z.object({
  asset: z.object({ _ref: z.string() }),
  alt: z.string().min(1, 'Image missing alt text'),
});

export const PostSchema = z.object({
  _id: z.string(),
  title: z.string(),
  slug: z.object({ current: z.string() }),
  publishedAt: z.string(),
  updatedAt: optional(z.string()),
  excerpt: z.string().max(200),
  cover: optional(imageSchema),
  tags: withDefault(z.array(z.string()), () => []),
  series: optional(z.object({ title: z.string(), slug: z.object({ current: z.string() }) })),
  body: withDefault(portableTextSchema, () => []),
  draft: withDefault(z.boolean(), () => false),
});

export const PostListSchema = PostSchema.omit({ body: true });

export const ProjectSchema = z.object({
  _id: z.string(),
  title: z.string(),
  slug: z.object({ current: z.string() }),
  role: optional(z.string()),
  period: optional(z.string()),
  stack: withDefault(z.array(z.string()), () => []),
  summary: z.string(),
  body: withDefault(portableTextSchema, () => []),
  links: withDefault(z.array(z.object({ label: z.string(), url: z.url() })), () => []),
  cover: optional(imageSchema),
  featured: withDefault(z.boolean(), () => false),
  order: withDefault(z.number(), () => 0),
});

export const ProjectListSchema = ProjectSchema.omit({ body: true });

export const ExperienceSchema = z.object({
  _id: z.string(),
  company: z.string(),
  role: z.string(),
  start: z.string(),
  end: optional(z.string()),
  location: optional(z.string()),
  highlights: withDefault(z.array(z.string()), () => []),
  stack: withDefault(z.array(z.string()), () => []),
  order: withDefault(z.number(), () => 0),
});

export const ProfileSchema = z.object({
  name: z.string(),
  headline: z.string(),
  bioShort: z.string(),
  bio: withDefault(portableTextSchema, () => []),
  location: z.string(),
  email: z.email(),
  socials: withDefault(z.array(z.object({ label: z.string(), url: z.url() })), () => []),
  // Projected as `cv{asset->{url}}`.
  cv: optional(z.object({ asset: z.object({ url: z.string() }) })),
  availableForWork: withDefault(z.boolean(), () => false),
  photo: imageSchema,
});

export const SeriesSchema = z.object({
  _id: z.string(),
  title: z.string(),
  slug: z.object({ current: z.string() }),
  description: optional(z.string()),
});
