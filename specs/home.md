# Spec: Home Page

Single-page overview: hero, about strip, featured work, latest posts. All data fetched at build time from Sanity.

## File

```
src/pages/index.astro
src/features/home/HeroPhoto.astro    (photo slot + seal corner)
```

## Data fetched at build time

```ts
const profile  = await getProfile();                              // bio, headline, photo
const projects = (await getProjects()).filter(p => p.featured);   // up to 3
const posts    = (await getPosts()).slice(0, 5);                  // latest 5
```

## Layout structure

```
<BaseLayout>
  <Hero />          ← two-column: text | photo
  <hr />
  <About />         ← bio + token demo tease
  <Work />          ← featured projects grid
  <Blog />          ← latest posts list
</BaseLayout>
```

## Hero section

Two-column grid. Left: text content. Right: profile photo (from Sanity `profile.photo`).

```astro
<section class="wrap hero">
  <div class="hero-text">
    <div class="row1 fade-up delay-1">
      <Seal size="lg" label="Caio" stamp />
      <p class="eyebrow">
        Frontend Engineer<br>
        {profile.location}
      </p>
    </div>
    <h1 class="fade-up delay-1">{profile.headline}</h1>
    <p class="hero-lead fade-up delay-2">{/* bio excerpt */}</p>
    <div class="cta fade-up delay-2">
      <a class="btn btn-fill" href="/playground">See the work</a>
      <a class="link mono" href="/work">experience &amp; timeline →</a>
    </div>
    <div class="chips fade-up delay-3">
      <span class="chip chip-lead">Vue · Nuxt</span>
      <span class="chip">TypeScript</span>
      <span class="chip">Tailwind</span>
      <span class="chip">Usability / a11y</span>
      <span class="chip">Architecture · refactoring</span>
      <span class="chip">React · Next (learning)</span>
    </div>
  </div>

  <HeroPhoto photo={profile.photo} />
</section>
```

### CSS for `.hero`

```css
.hero {
  display: grid;
  grid-template-columns: 1fr clamp(200px, 28vw, 320px);
  gap: clamp(40px, 7vw, 96px);
  align-items: center;
  padding-block: clamp(80px, 10vw, 140px);
}
.hero-lead {
  color: var(--ink-muted);
  font-size: clamp(1.1rem, 1rem + .5vw, 1.35rem);
  max-width: 52ch;
  margin-top: 1.8rem;
  line-height: 1.75;
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
  margin-top: 3rem;
  align-items: flex-start;   /* prevents stretch height mismatch */
}
.cta { display: flex; gap: 1.4rem; flex-wrap: wrap; align-items: center; margin-top: 2.4rem; }
.mono { font-family: var(--font-mono); font-size: .85rem; }
@media (max-width: 760px) {
  .hero { grid-template-columns: 1fr; }
}
```

## `src/features/home/HeroPhoto.astro`

Renders the profile photo from Sanity. Shows placeholder until photo is provided.

```astro
---
import { urlFor } from '../../content/imageUrl';
interface Props { photo?: { asset: object; alt: string } }
const { photo } = Astro.props;
const src = photo ? urlFor(photo.asset).width(640).height(640).fit('crop').url() : null;
---
<div class="hero-photo fade-up delay-2">
  {src
    ? <img src={src} alt={photo!.alt} width="320" height="320" loading="eager" />
    : <span class="photo-hint">profile photo</span>
  }
  <div class="seal-corner" aria-hidden="true">
    <span class="seal seal-sm">カ</span>
  </div>
</div>

<style>
  .hero-photo {
    position: relative;
    aspect-ratio: 1;
    border: 1px solid var(--line);
    background: var(--surface-sunk);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .hero-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .photo-hint {
    font-family: var(--font-mono);
    font-size: .68rem;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: var(--ink-faint);
  }
  .seal-corner { position: absolute; bottom: 14px; right: 14px; }
  @media (max-width: 760px) {
    .hero-photo { order: -1; max-width: 200px; }
  }
</style>
```

## About strip

```astro
<section class="band" id="about">
  <div class="wrap">
    <p class="eyebrow">About</p>
    <h2>{/* pull first sentence from bio or use a fixed tagline */}</h2>
    <div class="about-body">
      <PortableText value={profile.bio} />
    </div>
    <!-- Token demo tease (playground teaser) -->
    <div class="token-swatch-row" aria-label="Accent color demo — tokens are live">
      {/* swatch buttons — see design-system spec */}
    </div>
  </div>
</section>
```

```css
.about-body { max-width: 70%; margin-top: 1.2rem; color: var(--ink-muted); }
@media (max-width: 900px) { .about-body { max-width: 100%; } }
```

## Featured projects

```astro
<section class="band" id="projects">
  <div class="wrap">
    <p class="eyebrow">Work</p>
    <h2 class="h2lead">Selected projects.</h2>
    <div class="project-grid">
      {projects.map(p => <ProjectCard project={p} />)}
    </div>
    <a class="link" href="/work">Full experience & timeline →</a>
  </div>
</section>
```

`ProjectCard` lives in `src/features/work/ProjectCard.astro` (see `work.md` spec).

## Latest posts

```astro
<section class="band" id="blog">
  <div class="wrap">
    <p class="eyebrow">Blog · daily</p>
    <h2 class="h2lead">One idea about frontend, every day.</h2>
    <div class="post-list">
      {posts.map(p => <PostRow post={p} />)}
    </div>
    <a class="link" href="/blog">All posts →</a>
  </div>
</section>
```

`PostRow` lives in `src/features/blog/PostRow.astro` (see `blog.md` spec).

## OG image for home

Static `/og/default.png` — hand-crafted SVG converted to PNG at 1200×630, or generated via satori at build time. Include name + headline + seal mark.

## Structured data

```ts
const schema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: "Frontend Engineer",
  url: Astro.site?.toString(),
  sameAs: profile.socials.map(s => s.url),
};
```

## Definition of done

- Hero photo loads from Sanity with correct `alt`.
- Seal animates on load; motion-reduced users see it static.
- `prefers-color-scheme` dark: page renders in Sumi palette with no flash.
- Chips row has uniform height (no stretching).
- Lighthouse ≥ 95 — all four categories.
- Passes axe a11y check via Playwright.
