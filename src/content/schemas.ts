import type { ArbitraryTypedObject } from '@portabletext/types';
import { z } from 'zod';

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
  updatedAt: z.string().optional(),
  excerpt: z.string().max(200),
  cover: imageSchema.optional(),
  tags: z.array(z.string()).default([]),
  series: z
    .object({ title: z.string(), slug: z.object({ current: z.string() }) })
    .nullish()
    .transform((v) => v ?? undefined),
  body: portableTextSchema,
  draft: z.boolean().default(false),
});

export const PostListSchema = PostSchema.omit({ body: true });

export const ProjectSchema = z.object({
  _id: z.string(),
  title: z.string(),
  slug: z.object({ current: z.string() }),
  role: z.string().optional(),
  period: z.string().optional(),
  stack: z.array(z.string()).default([]),
  summary: z.string(),
  body: portableTextSchema,
  links: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
  cover: imageSchema.optional(),
  featured: z.boolean().default(false),
  order: z.number().default(0),
});

export const ProjectListSchema = ProjectSchema.omit({ body: true });

export const ExperienceSchema = z.object({
  _id: z.string(),
  company: z.string(),
  role: z.string(),
  start: z.string(),
  end: z
    .string()
    .nullish()
    .transform((v) => v ?? undefined),
  location: z.string().optional(),
  highlights: z.array(z.string()).default([]),
  order: z.number().default(0),
});

export const ProfileSchema = z.object({
  name: z.string(),
  headline: z.string(),
  bio: portableTextSchema,
  location: z.string(),
  email: z.email(),
  socials: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
  cv: z.object({ asset: z.object({ url: z.string() }) }).optional(),
  availableForWork: z.boolean().default(false),
  photo: imageSchema,
});

export const SeriesSchema = z.object({
  _id: z.string(),
  title: z.string(),
  slug: z.object({ current: z.string() }),
  description: z.string().optional(),
});
