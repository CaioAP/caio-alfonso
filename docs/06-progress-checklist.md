# 06 — Progress Checklist

Living status doc. Update as items land.

**Live:** https://caio-alfonso.pages.dev · **Studio:** https://caio-alfonso.sanity.studio
**Sanity:** project `ftpb674o`, dataset `production` (private)

## Foundations
- [x] Astro shell + Vue + React islands wired
- [x] Tailwind v4 via `@tailwindcss/vite`, tokens in `global.css`
- [x] TypeScript strict, `astro check` clean
- [x] Biome lint/format configured (also owns `studio/`)
- [x] Vitest unit tests (18 passing)
- [x] Playwright + axe e2e smoke (10 passing, flake-free)
- [x] CI workflow (`.github/workflows/ci.yml`): check → lint → test → build → e2e
- [ ] **CI secrets set in GitHub repo** (`SANITY_PROJECT_ID` etc.) — CI still builds off
      fixtures, so it cannot catch schema drift against real content

## Content layer
- [x] Sanity client + fixture fallback (`src/content/client.ts`, `fixtures.ts`)
- [x] GROQ queries for post/project/experience/profile/series
- [x] Zod schemas mirroring Sanity schemas, build fails on mismatch
- [x] Studio schemas: profile, post, project, experience, series
- [x] Real Sanity project created (`ftpb674o`)
- [x] Studio scaffolded and deployed (appId pinned)
- [x] `.env` populated with real project credentials
- [x] `codeInput` plugin registered for `post.body` code blocks
- [x] Sanity → Cloudflare Pages publish webhook wired and tested
- [x] Null-safe optional fields (`optional()` / `withDefault()` helpers) — GROQ
      projections return null, which `.optional()` rejects
- [x] `post.body` limited to h2–h4 (the page owns the h1); inline images require alt
- [ ] Real content authored:
  - [x] `profile` (bio, bioShort, socials, CV, photo)
  - [x] `experience` × 4
  - [x] `post` × 1
  - [ ] **`project` — none yet, `/work` and the home featured-work section are empty**
  - [ ] More posts (the premise is a daily blog)

## Pages / routes
- [x] `/` home (hero, about strip, experience, featured work, latest posts, accent picker)
- [x] `/about`
- [x] `/blog` index + `/blog/[slug]` + `/blog/series/[slug]`
- [x] `/work` index + `/work/[slug]`
- [x] `/playground` index + `/playground/[slug]`
- [x] `/colophon`
- [x] RSS (`rss.xml`), sitemap, `robots.txt`, OG image generation (`og/[slug].png.ts`)
- [x] Post cover image rendered; code blocks and inline images render in post bodies

## Playground demos (Tier 1)
- [x] Token Studio (React)
- [x] Contrast Checker (Vue)
- [x] Command Palette (Vue)
- [x] States Quartet (Vue)
- [ ] Tier 2/3 demos (ongoing backlog, `docs/04`)

## Design system
- [x] OKLCH color tokens, light/dark
- [x] Dark/light theme toggle, no-flash first paint, persisted
- [x] Hanko seal component, aria-label rules
- [x] Reduced-motion handling
- [x] Fonts self-hosted as subsetted woff2 (latin + single katakana glyph)
- [x] `@font-face` rules in `global.css`, preload for above-the-fold weights
- [x] Prose typography: heading scale + weight restored after Tailwind preflight,
      `--text-prose` for long-form body copy
- [x] In-text links carry a hairline underline, not colour alone (WCAG 1.4.1)

## Hosting / deploy
- [x] Cloudflare Pages project (Pages flow — **not** Workers; no adapter, no deploy command)
- [x] Repo connected, auto-deploy on push to `main`
- [x] Build env vars set in Cloudflare Pages
- [x] `main` is the GitHub default branch; stale `init` deleted
- [x] `site` in `astro.config.ts` points at the live URL
- [ ] Custom domain wired (then update `site` and `robots.txt`)

## Quality floor (non-negotiable per CLAUDE.md)
- [x] `astro check` passes (0 errors)
- [x] Biome lint passes
- [x] Vitest unit tests pass
- [x] `astro build` succeeds against real Sanity content
- [x] Playwright + axe: 10/10, verified stable across repeated runs
- [x] Lighthouse measured against the live site (first time)
  - `/` — perf 95, a11y 100, best-practices 100, SEO 92
  - `/blog/[slug]` — perf 100, a11y 96, best-practices 100, SEO 92
- [ ] **Re-measure Lighthouse after the robots.txt and link-underline fixes deploy**
      (both misses above are addressed; expect SEO and a11y at 100)
- [ ] Core Web Vitals field check post-launch (needs real traffic)

## Docs hygiene
- [x] `CLAUDE.md` rewritten to describe the deployed state, with the traps that
      actually cost deploys (GROQ nulls, Pages-vs-Workers, preflight, e2e races)
- [x] `specs/` per-feature implementation specs exist and match built features
- [x] `docs/` planning docs (spec, ADRs, stack, design system, backlog, roadmap)

## Phase 5 — optional / later
- [ ] Newsletter (RSS-to-email)
- [ ] Scheduled/cron daily publishing
- [ ] i18n (PT-BR / EN)
- [ ] Contact form (Worker or free form service)
