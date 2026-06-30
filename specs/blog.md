# Spec: Blog

Daily short-form writing. Index with tag filter, post detail, series grouping, RSS, OG images.

## Files

```
src/pages/
  blog/
    index.astro           # post list
    [slug].astro          # post detail
    series/[slug].astro   # series landing (phase 2)
  rss.xml.ts
  og/[slug].png.ts        # dynamic OG image generation

src/features/blog/
  PostRow.astro
  PostCard.astro
  TagFilter.astro         # client island (Vue or plain JS)
  SeriesBadge.astro
  ReadingTime.ts          # utility
```

## `src/pages/blog/index.astro`

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import PostRow    from '../../features/blog/PostRow.astro';
import { getPosts } from '../../content/queries';

const posts = await getPosts();
const tags  = [...new Set(posts.flatMap(p => p.tags))].sort();
---
<BaseLayout title="Blog — Caio" description="Daily frontend writing.">
  <section class="band">
    <div class="wrap">
      <p class="eyebrow">Blog · daily</p>
      <h1 class="h2lead">One idea about frontend, every day.</h1>
      <p class="lede">Short and shippable, organized into series so the cadence holds.</p>
      <!-- Tag filter: Vue island, client:load -->
      <TagFilter tags={tags} client:load />
      <div class="post-list" id="post-list">
        {posts.map(p => <PostRow post={p} />)}
      </div>
    </div>
  </section>
</BaseLayout>
```

## `src/features/blog/PostRow.astro`

```astro
---
import type { Post } from '../../content/types';
interface Props { post: Post }
const { post } = Astro.props;
const date = new Date(post.publishedAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
---
<a class="post-row" href={`/blog/${post.slug.current}`} data-tags={post.tags.join(',')}>
  <span class="pd">{date}</span>
  <span class="pt">{post.title}</span>
  {post.series && <span class="ps">{post.series.title}</span>}
</a>

<style>
  .post-row {
    display: grid;
    grid-template-columns: 96px 1fr auto;
    gap: 1.4rem;
    align-items: baseline;
    padding: 1.2rem 0;
    border-bottom: 1px solid var(--line);
    text-decoration: none;
    color: inherit;
  }
  .post-row:first-child { border-top: 1px solid var(--line); }
  .post-row:hover .pt  { color: var(--shu-strong); }
  .pd { font-family: var(--font-mono); font-size: .76rem; color: var(--ink-faint); }
  .pt { font-family: var(--font-display); font-weight: 700; font-size: 1.08rem; transition: color 140ms; }
  .ps { font-family: var(--font-mono); font-size: .68rem; color: var(--ink-faint); white-space: nowrap; }
  @media (max-width: 560px) {
    .post-row { grid-template-columns: 1fr; gap: .2rem; }
    .ps { display: none; }
  }
</style>
```

## `src/pages/blog/[slug].astro`

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Prose      from '../../components/Prose.astro';
import { getPost, getPosts } from '../../content/queries';
import { PortableText } from 'astro-portabletext';   // or @portabletext/react wrapped in island

export async function getStaticPaths() {
  const posts = await getPosts();
  return posts.map(p => ({ params: { slug: p.slug.current } }));
}

const { slug }  = Astro.params;
const post      = await getPost(slug);
const reading   = readingTime(post.body);
const ogImage   = new URL(`/og/${slug}.png`, Astro.site).toString();

const schema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: post.title,
  datePublished: post.publishedAt,
  dateModified:  post.updatedAt ?? post.publishedAt,
  description:   post.excerpt,
  image: ogImage,
  author: { "@type": "Person", name: "Caio" },
};
---
<BaseLayout title={`${post.title} — Caio`} description={post.excerpt} ogImage={ogImage}>
  <script type="application/ld+json" set:html={JSON.stringify(schema)} slot="head" />
  <article class="band">
    <div class="wrap">
      <header>
        <p class="eyebrow">
          {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          {post.series && <> · <a href={`/blog/series/${post.series.slug.current}`}>{post.series.title}</a></>}
          · {reading} min read
        </p>
        <h1>{post.title}</h1>
        <p class="excerpt">{post.excerpt}</p>
      </header>
      <Prose>
        <PortableText value={post.body} />
      </Prose>
      <footer class="post-footer">
        {post.tags.map(t => <span class="chip">{t}</span>)}
      </footer>
    </div>
  </article>
</BaseLayout>
```

## `src/features/blog/ReadingTime.ts`

```ts
export function readingTime(body: unknown[]): number {
  // Count text characters in portable text blocks
  const text = body
    .filter((b: any) => b._type === 'block' && b.children)
    .flatMap((b: any) => b.children.map((c: any) => c.text ?? ''))
    .join(' ');
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
```

## `src/pages/rss.xml.ts`

```ts
import rss from '@astrojs/rss';
import { getPosts } from '../content/queries';

export async function GET(context: { site: URL }) {
  const posts = await getPosts();
  return rss({
    title: 'Caio — Frontend Blog',
    description: 'Daily frontend writing.',
    site: context.site,
    items: posts.map(p => ({
      title:       p.title,
      pubDate:     new Date(p.publishedAt),
      description: p.excerpt,
      link:        `/blog/${p.slug.current}`,
    })),
  });
}
```

## `src/pages/og/[slug].png.ts` — OG image generation

Use `satori` + `@resvg/resvg-js` (both run in Node at build time):

```ts
import satori      from 'satori';
import { Resvg }   from '@resvg/resvg-js';
import { getPosts } from '../../content/queries';
import fs from 'node:fs';

const font = fs.readFileSync('public/fonts/ZenKakuGothicNew-Regular.woff');

export async function getStaticPaths() {
  const posts = await getPosts();
  return posts.map(p => ({ params: { slug: p.slug.current }, props: { post: p } }));
}

export async function GET({ props }: { props: { post: any } }) {
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%', height: '100%',
          background: '#f5f3ed',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'flex-end', padding: '60px',
          fontFamily: 'ZenKakuGothicNew',
        },
        children: [
          { type: 'p', props: { style: { fontSize: 18, color: '#9b9389', marginBottom: 16 }, children: 'caio.dev' } },
          { type: 'h1', props: { style: { fontSize: 48, color: '#2b2620', lineHeight: 1.2 }, children: props.post.title } },
        ],
      },
    },
    { width: 1200, height: 630, fonts: [{ name: 'ZenKakuGothicNew', data: font, weight: 400 }] }
  );
  const png = new Resvg(svg).render().asPng();
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
}
```

Install: `npm i satori @resvg/resvg-js`

## `src/features/blog/TagFilter.vue` — client island

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{ tags: string[] }>();
const active = ref<string | null>(null);

function toggle(tag: string) {
  active.value = active.value === tag ? null : tag;
  // filter .post-row elements by data-tags attribute
  document.querySelectorAll<HTMLElement>('.post-row').forEach(el => {
    const tags = el.dataset.tags?.split(',') ?? [];
    el.style.display = (!active.value || tags.includes(active.value)) ? '' : 'none';
  });
}
</script>

<template>
  <div class="tag-filter" role="group" aria-label="Filter by tag">
    <button
      v-for="tag in tags" :key="tag"
      :class="['chip', active === tag ? 'chip-lead' : '']"
      @click="toggle(tag)"
    >{{ tag }}</button>
  </div>
</template>
```

## Series landing (`/blog/series/[slug]`) — Phase 2

Minimal: eyebrow + series title + description + list of PostRow for posts in series. Same pattern as blog index, filtered.

## Definition of done

- RSS feed validates at w3.org/Feed_Validation.
- OG images render at 1200×630 with post title.
- Tag filter works without JS (shows all); JS enhances.
- Post pages have `Article` structured data.
- All post pages pass axe.
- `readingTime()` used in heading — never 0.
