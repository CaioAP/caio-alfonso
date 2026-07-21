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
- [x] Playwright + axe e2e smoke config
- [x] CI workflow (`.github/workflows/ci.yml`): check → lint → test → build → e2e
- [ ] CI secrets set in GitHub repo (`SANITY_PROJECT_ID` etc.) — CI still builds off fixtures

## Content layer
- [x] Sanity client + fixture fallback (`src/content/client.ts`, `fixtures.ts`)
- [x] GROQ queries for post/project/experience/profile/series
- [x] Zod schemas mirroring Sanity schemas, build fails on mismatch
- [x] Studio schemas written (`studio/schemas/*.ts`): profile, post, project, experience, series
- [x] Real Sanity project created (`ftpb674o`)
- [x] Studio scaffolded and deployed (`caio-alfonso.sanity.studio`, appId pinned)
- [x] `.env` populated with real project credentials
- [x] `codeInput` plugin registered for `post.body` code blocks
- [ ] Sanity → Cloudflare Pages publish webhook wired
- [ ] Real content authored:
  - [x] `profile` (bio, bioShort, socials, CV, photo)
  - [x] `experience` × 4
  - [ ] `project` — none yet, `/work` index is empty
  - [ ] `post` — none yet, `/blog` index is empty

## Pages / routes
- [x] `/` home (hero, about strip, experience, featured work, latest posts, accent picker)
- [x] `/about`
- [x] `/blog` index + `/blog/[slug]` + `/blog/series/[slug]`
- [x] `/work` index + `/work/[slug]`
- [x] `/playground` index + `/playground/[slug]`
- [x] `/colophon`
- [x] RSS (`rss.xml`), sitemap, OG image generation (`og/[slug].png.ts`)

## Playground demos (Tier 1)
- [x] Token Studio (React)
- [x] Contrast Checker (Vue)
- [x] Command Palette (Vue)
- [x] States Quartet (Vue) — stateful form equivalent
- [ ] Tier 2/3 demos (ongoing backlog, `docs/04`)

## Design system
- [x] OKLCH color tokens, light/dark (`--paper`/`--surface`/`--shu` etc.)
- [x] Dark/light theme toggle, no-flash first paint, persisted
- [x] Hanko seal component, aria-label rules
- [x] Reduced-motion handling
- [x] Fonts self-hosted as subsetted woff2 (latin + single katakana glyph)
- [x] `@font-face` rules in `global.css`, preload for above-the-fold weights
- [x] `ZenKakuGothicNew-Regular.ttf` moved to `src/assets/fonts/` (build-time OG only, not served)

## Hosting / deploy
- [x] Cloudflare Pages project created (Pages flow, not Workers — no adapter, no deploy command)
- [x] Repo connected to Cloudflare Pages (auto-deploy on push to `main`)
- [x] Build env vars set in Cloudflare Pages
- [x] `main` is the GitHub default branch; stale `init` deleted
- [ ] Custom domain wired
- [ ] **`site` in `astro.config.ts` still the `https://caio.dev` placeholder** — canonical
      and `og:image` URLs on the live site currently point at a non-serving domain

## Known gaps in shipped code
- [ ] `src/pages/blog/[slug].astro` renders PortableText with default components — `code`
      blocks authored in the Studio will not render as code. Needed before the first
      code-bearing post.
- [ ] `@sanity/image-url` default-export deprecation warning on every build; switch to the
      named `createImageUrlBuilder` export.

## Quality floor (non-negotiable per CLAUDE.md)
- [x] `astro check` passes (0 errors)
- [x] Biome lint passes
- [x] Vitest unit tests pass
- [x] `astro build` succeeds against real Sanity content
- [x] Playwright + axe smoke run passed locally
- [ ] Lighthouse ≥95 across all 4 categories — now unblocked, site is live
- [ ] WCAG 2.2 AA confirmed against the deployed site — now unblocked
- [ ] Core Web Vitals field check post-launch

## Docs hygiene
- [ ] `CLAUDE.md` still says "planning phase, no implementation exists" — stale, needs rewrite
- [x] `specs/` per-feature implementation specs exist and match built features
- [x] `docs/` planning docs (spec, ADRs, stack, design system, backlog, roadmap)

## Phase 5 — optional / later
- [ ] Newsletter (RSS-to-email)
- [ ] Scheduled/cron daily publishing
- [ ] i18n (PT-BR / EN)
- [ ] Contact form (Worker or free form service)
