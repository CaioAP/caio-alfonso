# Spec: Shell — Layout, Header, Footer

Wraps every page. Header is sticky, transparent-blur. Footer is minimal. BaseLayout injects meta, fonts, global CSS.

## Files

```
src/layouts/BaseLayout.astro
src/components/Header.astro
src/components/Footer.astro
src/components/SkipLink.astro
src/components/Prose.astro
```

## `src/layouts/BaseLayout.astro`

```astro
---
import '../styles/global.css';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import SkipLink from '../components/SkipLink.astro';

interface Props {
  title: string;
  description?: string;
  ogImage?: string;   // absolute URL to OG image
  noindex?: boolean;
}

const { title, description = '', ogImage, noindex = false } = Astro.props;
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
const ogUrl = ogImage ?? new URL('/og/default.png', Astro.site).toString();
---
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title}</title>
  {description && <meta name="description" content={description} />}
  <link rel="canonical" href={canonicalURL} />
  {noindex && <meta name="robots" content="noindex" />}

  <!-- OG / Twitter -->
  <meta property="og:title"       content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url"         content={canonicalURL} />
  <meta property="og:image"       content={ogUrl} />
  <meta property="og:type"        content="website" />
  <meta name="twitter:card"       content="summary_large_image" />
  <meta name="twitter:image"      content={ogUrl} />

  <!-- Fonts (replace with self-hosted woff2 in production) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Zen+Old+Mincho:wght@400;700&family=Zen+Kaku+Gothic+New:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

  <!-- Favicon -->
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />

  <!-- Theme: set before first paint to prevent flash -->
  <script is:inline>
    (function(){
      const t = localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', t);
    })();
  </script>
</head>
<body>
  <SkipLink />
  <Header />
  <main id="main-content" tabindex="-1">
    <slot />
  </main>
  <Footer />
</body>
</html>
```

## `src/components/SkipLink.astro`

```astro
<a href="#main-content" class="skip-link">Skip to content</a>

<style>
  .skip-link {
    position: absolute;
    top: -100%;
    left: 1rem;
    padding: .5rem 1rem;
    background: var(--shu);
    color: var(--on-shu);
    font-family: var(--font-mono);
    font-size: .84rem;
    border-radius: 0 0 var(--radius-1) var(--radius-1);
    z-index: 9999;
    transition: top .14s;
  }
  .skip-link:focus { top: 0; }
</style>
```

## `src/components/Header.astro`

```astro
---
import Seal from './Seal.astro';
import ThemeToggle from './ThemeToggle.astro';
---
<header class="site-header">
  <div class="wrap">
    <nav class="site-nav" aria-label="Primary">
      <a class="brand" href="/">
        <Seal size="sm" label="Caio" />
        <span class="brand-name">Caio</span>
      </a>
      <ul role="list">
        <li><a href="/#about">about</a></li>
        <li><a href="/work">experience</a></li>
        <li><a href="/playground">playground</a></li>
        <li><a href="/blog">blog</a></li>
      </ul>
      <ThemeToggle />
    </nav>
  </div>
</header>

<style>
  .site-header {
    position: sticky;
    top: 0;
    z-index: 50;
    background: color-mix(in oklch, var(--paper) 88%, transparent);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--line);
  }
  .site-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 68px;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: .7rem;
    text-decoration: none;
    color: var(--ink);
  }
  .brand-name {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 1.12rem;
    letter-spacing: .02em;
  }
  ul {
    display: flex;
    gap: 1.6rem;
    list-style: none;
    margin: 0; padding: 0;
  }
  ul a {
    color: var(--ink-muted);
    text-decoration: none;
    font-size: .88rem;
    font-family: var(--font-mono);
    letter-spacing: .04em;
  }
  ul a:hover { color: var(--ink); }
  @media (max-width: 760px) { ul { display: none; } }
</style>
```

## `src/components/Footer.astro`

```astro
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-row">
      <p>© {new Date().getFullYear()} Caio · Frontend Engineer · Goiânia</p>
      <nav aria-label="Footer">
        <a href="https://github.com/CaioAP" class="link" target="_blank" rel="noopener">GitHub</a>
        <a href="https://www.linkedin.com/in/caio-alfonso-597b8196/" class="link" target="_blank" rel="noopener">LinkedIn</a>
        <a href="/rss.xml" class="link">RSS</a>
        <a href="/cv.pdf" class="link" download>CV ↓</a>
      </nav>
    </div>
  </div>
</footer>

<style>
  .site-footer { border-top: 1px solid var(--line); }
  .footer-row {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
    padding-block: 2.4rem;
    color: var(--ink-muted);
    font-size: .86rem;
  }
  nav { display: flex; gap: 1.4rem; }
  nav a { font-family: var(--font-mono); font-size: .8rem; }
</style>
```

## `src/components/Prose.astro`

Wrapper for Portable Text rendered content.

```astro
---
interface Props { class?: string; }
const { class: cls } = Astro.props;
---
<div class:list={['prose', cls]}>
  <slot />
</div>
```

## `.wrap` utility

The `.wrap` class is in `global.css` (or as a Tailwind utility via `@layer`):

```css
.wrap {
  max-width: 1180px;
  margin-inline: auto;
  padding-inline: clamp(22px, 5vw, 56px);
}
```

## Structured data (JSON-LD)

Add to `BaseLayout.astro` `<head>` for post pages:

```astro
{schema && (
  <script type="application/ld+json" set:html={JSON.stringify(schema)} />
)}
```

Pass `schema` prop from each page. Post pages use `Article`, home uses `Person`.

## Definition of done

- Skip link visible on first Tab keypress.
- Header stays sticky; nav links scroll to correct anchors.
- No flash of wrong theme on initial load.
- Footer links all have `aria-label` or clear text.
- `astro check` passes.
