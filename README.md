# caio.dev — Portfolio & Daily Frontend Blog

> Personal portfolio and daily frontend blog. Astro shell with Vue 3 + React 19 islands, Tailwind v4 design tokens, Sanity CMS, deployed on Cloudflare Pages. The site itself is the work sample: ~0 KB JS on content pages, WCAG 2.2 AA, Lighthouse ≥ 95.

The design language is **余白 / Yohaku** — Japanese spatial minimalism. Washi off-white ↔ warm sumi charcoal, a single vermilion hanko seal, and generous negative space. Content pages ship zero JavaScript; interactive demos hydrate as isolated islands (some Vue, some React — the range is the point).

## Stack

| Layer | Choice |
|---|---|
| Framework | [Astro](https://astro.build) (static output) |
| Islands | Vue 3 (primary) + React 19 (showcase) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite` — CSS-first `@theme`, OKLCH token system |
| Content | [Sanity](https://sanity.io) headless CMS (falls back to local fixtures without credentials) |
| Validation | Zod — content is schema-checked at build time; bad content fails the build |
| Testing | Vitest (unit) · Playwright + axe-core (e2e + a11y) |
| Lint/format | Biome |
| Hosting | Cloudflare Pages |

## Getting started

Requires **Node 20+**.

```bash
npm install
npm run dev          # dev server at http://localhost:4321
```

Without Sanity credentials the site builds from local sample content (`src/content/fixtures.ts`) and logs a warning — everything works offline. To build from real content:

```bash
cp .env.example .env # then fill in the Sanity values
```

| Variable | Purpose |
|---|---|
| `SANITY_PROJECT_ID` | Sanity project id |
| `SANITY_DATASET` | usually `production` |
| `SANITY_API_VERSION` | e.g. `2024-01-01` |
| `SANITY_READ_TOKEN` | read-only token, build-time only — never exposed to the client |

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build to `dist/` (pages, RSS, sitemap, OG images) |
| `npm run preview` | Serve the production build locally |
| `npm run check` | `astro check` — TypeScript across `.astro`/`.ts` files |
| `npm run lint` | Biome lint + format check |
| `npm run test` | Vitest unit tests |
| `npm run test:e2e` | Playwright smoke tests + axe WCAG 2.2 AA audit on key routes |

First e2e run needs a browser: `npx playwright install chromium`.

CI (`.github/workflows/ci.yml`) runs check → lint → test → build → e2e on every push and PR.

## Project structure

```
src/
├─ components/       # cross-feature primitives (Seal, ThemeToggle, Prose, SkipLink…)
├─ content/          # Sanity client, GROQ queries, Zod schemas, fixtures
├─ features/
│  ├─ blog/          # PostRow, TagFilter (Vue island), reading time
│  ├─ work/          # TimelineRow, ProjectCard
│  ├─ home/          # HeroPhoto
│  └─ playground/    # _registry.ts + one folder per demo
├─ layouts/          # BaseLayout (meta, OG, JSON-LD, theme script)
├─ lib/              # framework-agnostic helpers (color math, OG renderer)
├─ pages/            # file-based routes
└─ styles/           # global.css — the entire token system
studio/              # Sanity Studio schemas (scaffold Studio separately, see studio/README.md)
docs/                # planning docs & ADRs
specs/               # per-feature implementation specs
```

Adding a Playground demo: create a folder under `src/features/playground/` and add one entry to `_registry.ts` — nothing else changes.

## Publishing content

Sanity Studio publish → webhook → Cloudflare Pages rebuild → live in ~1–3 minutes. No code, no manual deploy. Wiring steps in [`studio/README.md`](studio/README.md).

## Docs

Planning documents in [`docs/`](docs/) (project spec, ADRs, stack & services, design system, backlog, roadmap) and per-feature implementation specs in [`specs/`](specs/). The design rationale is also on the site itself at `/colophon`.
