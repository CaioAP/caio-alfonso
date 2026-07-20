# Spec: Sanity CMS

Covers Studio schemas, client setup, GROQ queries, Zod mirrors, and the webhook → rebuild pipeline.

## Files

```
studio/
  sanity.config.ts
  schemas/
    profile.ts
    post.ts
    project.ts
    experience.ts
    series.ts
    index.ts

src/content/
  client.ts          # @sanity/client instance
  queries.ts         # GROQ per content type
  schemas.ts         # Zod mirrors
  types.ts           # inferred from Zod
  imageUrl.ts        # @sanity/image-url builder
```

## Studio — `studio/sanity.config.ts`

```ts
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemas } from './schemas';

export default defineConfig({
  name: 'caio-portfolio',
  title: 'Caio Portfolio',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: 'production',
  plugins: [structureTool(), visionTool()],
  schema: { types: schemas },
});
```

## Schemas

### `studio/schemas/profile.ts` (singleton)

```ts
import { defineType, defineField } from 'sanity';
export const profile = defineType({
  name: 'profile', title: 'Profile', type: 'document',
  fields: [
    defineField({ name: 'name',            type: 'string',        title: 'Name' }),
    defineField({ name: 'headline',        type: 'string',        title: 'Headline' }),
    defineField({ name: 'bioShort',         type: 'text',          title: 'Bio (short, home page)' }),
    defineField({ name: 'bio',             type: 'array', of: [{ type: 'block' }], title: 'Bio (full, about page)' }),
    defineField({ name: 'location',        type: 'string',        title: 'Location' }),
    defineField({ name: 'email',           type: 'string',        title: 'Email' }),
    defineField({ name: 'socials',         type: 'array',         title: 'Socials',
      of: [{ type: 'object', fields: [
        { name: 'label', type: 'string' },
        { name: 'url',   type: 'url' },
      ]}],
    }),
    defineField({ name: 'cv',             type: 'file',          title: 'CV (PDF)' }),
    defineField({ name: 'availableForWork', type: 'boolean',     title: 'Available for work?' }),
    defineField({ name: 'photo',           type: 'image',         title: 'Profile photo',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
      validation: r => r.required(),
    }),
  ],
});
```

### `studio/schemas/post.ts`

```ts
import { defineType, defineField } from 'sanity';
export const post = defineType({
  name: 'post', title: 'Post', type: 'document',
  fields: [
    defineField({ name: 'title',       type: 'string',   validation: r => r.required() }),
    defineField({ name: 'slug',        type: 'slug',     options: { source: 'title' }, validation: r => r.required() }),
    defineField({ name: 'publishedAt', type: 'datetime', validation: r => r.required() }),
    defineField({ name: 'updatedAt',   type: 'datetime' }),
    defineField({ name: 'excerpt',     type: 'text',     rows: 3, validation: r => r.required().max(200) }),
    defineField({ name: 'cover',       type: 'image',    options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', validation: r => r.required() }],
    }),
    defineField({ name: 'tags',        type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'series',      type: 'reference', to: [{ type: 'series' }] }),
    defineField({ name: 'body',        type: 'array', of: [{ type: 'block' }, { type: 'image' }, { type: 'code' }] }),
    defineField({ name: 'draft',       type: 'boolean', initialValue: true }),
  ],
  orderings: [{ title: 'Newest', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] }],
});
```

### `studio/schemas/project.ts`

```ts
import { defineType, defineField } from 'sanity';
export const project = defineType({
  name: 'project', title: 'Project', type: 'document',
  fields: [
    defineField({ name: 'title',    type: 'string',   validation: r => r.required() }),
    defineField({ name: 'slug',     type: 'slug',     options: { source: 'title' } }),
    defineField({ name: 'role',     type: 'string' }),
    defineField({ name: 'period',   type: 'string' }),
    defineField({ name: 'stack',    type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'summary',  type: 'text' }),
    defineField({ name: 'body',     type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'links',    type: 'array',
      of: [{ type: 'object', fields: [{ name: 'label', type: 'string' }, { name: 'url', type: 'url' }] }],
    }),
    defineField({ name: 'cover',    type: 'image', options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', validation: r => r.required() }],
    }),
    defineField({ name: 'featured', type: 'boolean', initialValue: false }),
    defineField({ name: 'order',    type: 'number' }),
  ],
});
```

### `studio/schemas/experience.ts`

```ts
import { defineType, defineField } from 'sanity';
export const experience = defineType({
  name: 'experience', title: 'Experience', type: 'document',
  fields: [
    defineField({ name: 'company',    type: 'string', validation: r => r.required() }),
    defineField({ name: 'role',       type: 'string', validation: r => r.required() }),
    defineField({ name: 'start',      type: 'date',   validation: r => r.required() }),
    defineField({ name: 'end',        type: 'date' }),   // null = Present
    defineField({ name: 'location',   type: 'string' }),
    defineField({ name: 'highlights', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'stack',      type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'order',      type: 'number' }),
  ],
});
```

### `studio/schemas/series.ts`

```ts
import { defineType, defineField } from 'sanity';
export const series = defineType({
  name: 'series', title: 'Series', type: 'document',
  fields: [
    defineField({ name: 'title',       type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug',        type: 'slug',   options: { source: 'title' } }),
    defineField({ name: 'description', type: 'text' }),
  ],
});
```

### `studio/schemas/index.ts`

```ts
import { profile }    from './profile';
import { post }       from './post';
import { project }    from './project';
import { experience } from './experience';
import { series }     from './series';
export const schemas = [profile, post, project, experience, series];
```

## `src/content/client.ts`

```ts
import { createClient } from '@sanity/client';

export const sanity = createClient({
  projectId: import.meta.env.SANITY_PROJECT_ID,
  dataset:   import.meta.env.SANITY_DATASET,
  apiVersion: import.meta.env.SANITY_API_VERSION,
  token:     import.meta.env.SANITY_READ_TOKEN,
  useCdn:    false,   // always build-time; CDN not needed
});
```

## `src/content/imageUrl.ts`

```ts
import imageUrlBuilder from '@sanity/image-url';
import { sanity } from './client';

const builder = imageUrlBuilder(sanity);
export const urlFor = (source: object) => builder.image(source);
```

## `src/content/schemas.ts` — Zod mirrors

Fail the build on schema mismatch (missing alt, etc.).

```ts
import { z } from 'zod';

const imageSchema = z.object({
  asset: z.object({ _ref: z.string() }),
  alt:   z.string().min(1, 'Image missing alt text'),
});

export const PostSchema = z.object({
  _id:         z.string(),
  title:       z.string(),
  slug:        z.object({ current: z.string() }),
  publishedAt: z.string(),
  updatedAt:   z.string().optional(),
  excerpt:     z.string().max(200),
  cover:       imageSchema.optional(),
  tags:        z.array(z.string()).default([]),
  series:      z.object({ title: z.string(), slug: z.object({ current: z.string() }) }).optional(),
  body:        z.array(z.unknown()),
  draft:       z.boolean().default(false),
});

export const ProjectSchema = z.object({
  _id:      z.string(),
  title:    z.string(),
  slug:     z.object({ current: z.string() }),
  role:     z.string().optional(),
  period:   z.string().optional(),
  stack:    z.array(z.string()).default([]),
  summary:  z.string(),
  body:     z.array(z.unknown()),
  links:    z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
  cover:    imageSchema.optional(),
  featured: z.boolean().default(false),
  order:    z.number().default(0),
});

export const ExperienceSchema = z.object({
  _id:        z.string(),
  company:    z.string(),
  role:       z.string(),
  start:      z.string(),
  end:        z.string().optional(),
  location:   z.string().optional(),
  highlights: z.array(z.string()).default([]),
  stack:      z.array(z.string()).default([]),
  order:      z.number().default(0),
});

export const ProfileSchema = z.object({
  name:            z.string(),
  headline:        z.string(),
  bioShort:        z.string(),
  bio:             z.array(z.unknown()),
  location:        z.string(),
  email:           z.string().email(),
  socials:         z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
  cv:              z.object({ asset: z.object({ url: z.string() }) }).optional(),
  availableForWork: z.boolean().default(false),
  photo:           imageSchema,
});

export const SeriesSchema = z.object({
  _id:         z.string(),
  title:       z.string(),
  slug:        z.object({ current: z.string() }),
  description: z.string().optional(),
});
```

## `src/content/types.ts`

```ts
import type { z } from 'zod';
import type { PostSchema, ProjectSchema, ExperienceSchema, ProfileSchema, SeriesSchema } from './schemas';

export type Post       = z.infer<typeof PostSchema>;
export type Project    = z.infer<typeof ProjectSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type Profile    = z.infer<typeof ProfileSchema>;
export type Series     = z.infer<typeof SeriesSchema>;
```

## `src/content/queries.ts`

```ts
import { sanity }  from './client';
import { PostSchema, ProjectSchema, ExperienceSchema, ProfileSchema, SeriesSchema } from './schemas';
import type { Post, Project, Experience, Profile, Series } from './types';

/** Throws if Sanity returns data that fails Zod validation. Fails the build loudly. */
function validate<T>(schema: { parse(d: unknown): T }, data: unknown): T {
  return schema.parse(data);
}

export async function getPosts(): Promise<Post[]> {
  const data = await sanity.fetch(`
    *[_type == "post" && !draft] | order(publishedAt desc) {
      _id, title, slug, publishedAt, updatedAt, excerpt, cover, tags,
      series->{ title, slug }, draft
    }
  `);
  return data.map((d: unknown) => validate(PostSchema.omit({ body: true }), d));
}

export async function getPost(slug: string): Promise<Post> {
  const data = await sanity.fetch(
    `*[_type == "post" && slug.current == $slug && !draft][0] {
      _id, title, slug, publishedAt, updatedAt, excerpt, cover, tags,
      series->{ title, slug }, body, draft
    }`,
    { slug }
  );
  if (!data) throw new Error(`Post not found: ${slug}`);
  return validate(PostSchema, data);
}

export async function getProjects(): Promise<Project[]> {
  const data = await sanity.fetch(`
    *[_type == "project"] | order(order asc) {
      _id, title, slug, role, period, stack, summary, links, cover, featured, order
    }
  `);
  return data.map((d: unknown) => validate(ProjectSchema.omit({ body: true }), d));
}

export async function getProject(slug: string): Promise<Project> {
  const data = await sanity.fetch(
    `*[_type == "project" && slug.current == $slug][0]`,
    { slug }
  );
  if (!data) throw new Error(`Project not found: ${slug}`);
  return validate(ProjectSchema, data);
}

export async function getExperiences(): Promise<Experience[]> {
  const data = await sanity.fetch(`
    *[_type == "experience"] | order(order asc)
  `);
  return data.map((d: unknown) => validate(ExperienceSchema, d));
}

export async function getProfile(): Promise<Profile> {
  const data = await sanity.fetch(`*[_type == "profile"][0]`);
  if (!data) throw new Error('Profile document missing in Sanity');
  return validate(ProfileSchema, data);
}
```

## Webhook → Cloudflare Pages rebuild

1. Cloudflare Pages → Settings → Builds → Deploy Hooks → create hook URL.
2. Sanity Studio → Manage → API → Webhooks → add webhook:
   - URL: paste Cloudflare hook URL
   - Trigger on: `publish`
   - Filter: `_type in ["post", "project", "experience", "profile"]`

## Definition of done

- `getProfile()` throws (and thus fails the build) if `profile.photo.alt` is missing.
- All queries return typed data — no `any`.
- `astro check` passes.
- Publish a post in Studio → Cloudflare deploys within 3 minutes.
