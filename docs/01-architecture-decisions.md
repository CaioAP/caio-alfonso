# 01 — Architecture Decision Records

Each ADR records a decision, the context, the alternatives weighed, and the consequences. Format: lightweight [MADR](https://adr.github.io/madr/). Status values: Proposed / Accepted / Superseded.

> These are **proposals** pending your confirmation on ADR-001 and ADR-002 — every other decision follows from those two.

---

## ADR-001 — Use Astro as the site shell, with Vue + React islands

**Status:** Accepted (2026-06-30) — confirmed by owner
**Date:** 2026-06-30

### Context
The site is content-heavy (a daily blog + project pages) with a few genuinely interactive widgets. You're strongest in Vue/Nuxt and are learning React/Next. The portfolio must itself be evidence of frontend skill (perf, a11y) and of *range*.

### Decision
Build the shell, content, and routing in **Astro 6**. Build each interactive demo as an **island** — and deliberately implement some islands in **Vue** and some in **React**, so the codebase itself demonstrates both stacks. Static content routes ship effectively **zero JS**.

### Alternatives considered
- **Nuxt 4 (pure Vue).** Your daily driver; excellent DX; `@nuxt/content` is great; Nuxt UI v4 is now fully open-source and free. *Downside for this brief:* a Vue-only portfolio can't show React in the same codebase, and you ship Vue runtime on pages that don't need any JS. Still a completely valid choice — see "If you choose Nuxt instead" below.
- **Next.js (pure React).** Plays to the learning goal and is great if you want to *prove* React. *Downside:* you'd be building your shop window in your weakest framework; and Vercel's free tier forbids commercial use.
- **SvelteKit / plain Vite SPA.** Neither matches your stack story; SPA hurts SEO and first-load for a content site.

### Why Astro wins here
1. **Content-first.** Type-safe Content Collections (or a CMS) + Markdown/MDX, file-based routing, built-in RSS, sitemap, and OG image generation.
2. **Performance is the demo.** Islands architecture ships almost no JS by default → top Core Web Vitals, which *is* the usability claim made visible.
3. **Framework-agnostic islands.** One repo can host `.vue` and `.tsx` islands side by side — your Vue mastery and your React learning, both on display.
4. **Cheap & portable.** Static output deploys free anywhere; no platform lock-in.

### Consequences
- (+) Best-in-class perf/SEO with little effort; both frameworks showcased; lowest hosting cost.
- (+) Each demo is an isolated unit — easy to add to the Playground over time.
- (−) Astro is not your daily tool; small ramp-up (it's HTML-first and quick to learn).
- (−) Two island frameworks = two small toolchains. Mitigate by defaulting to Vue and using React only where you want to demonstrate it.

### If you choose Nuxt instead
Swap Astro→**Nuxt 4**, Content Collections→**@nuxt/content** (file-based) or keep Sanity, components→**Nuxt UI v4**. Hosting stays Cloudflare (NuxtHub / Cloudflare preset) — `output` SSG with on-demand revalidation, or full SSR on Workers. Everything else in these docs is unchanged. Trade-off: lose the in-repo React showcase; gain a single, familiar toolchain.

---

## ADR-002 — Content lives in a managed headless CMS (Sanity), not in the repo

**Status:** Accepted (2026-06-30) — confirmed by owner
**Date:** 2026-06-30

### Context
Hard requirement: **publish/edit projects and posts without uploading code or manually redeploying.** Two families of solutions:

- **Git-based** (Astro Content Collections / `@nuxt/content` + an editing UI like Decap, TinaCMS, or Pages CMS): content is Markdown in the repo; the editing UI commits for you, which triggers a rebuild.
- **Managed headless CMS** (Sanity, Hygraph, Contentful, Storyblok): content lives in a hosted store, edited in a web Studio; a webhook triggers a rebuild (SSG) or the page revalidates (SSR/ISR).

### Decision
Use **Sanity** (free tier) as the content store for **Post**, **Project**, **Experience**, and **Profile**. Publishing in Sanity Studio fires a deploy webhook to Cloudflare Pages; the site rebuilds and is live in minutes. Editing requires **no code and no git**.

### Why Sanity
- Free tier is production-viable for a personal site indefinitely (see services doc for exact limits).
- Schemas are defined in TypeScript and the Studio is a customizable React app — itself a portfolio-worthy integration.
- Structured content + Portable Text + an image CDN with on-the-fly transforms.
- It demonstrates a real-world skill (headless CMS integration) that the git-based route does not.

### Alternatives considered
- **Astro Content Collections (git-based), edited via Pages CMS / TinaCMS / Decap.** *Cheapest and simplest* — zero extra services, content versioned in git. Editing still happens in a UI (no raw code), and the commit→rebuild is automatic, so it technically satisfies the requirement. *Downside:* content coupled to the repo; image handling is more manual; less of a "look, I integrated a CMS" story. **This is the recommended fallback if you'd rather avoid a second service.**
- **Notion as CMS.** Truly free, lovely editor. *Downside:* API rate limits, not built for this, fragile schema.
- **Contentful / Storyblok / Hygraph.** Fine, but Sanity's free tier and DX are the best fit here.

### Consequences
- (+) Publish from anywhere, no git, no redeploy by hand; clean separation of content and code.
- (+) Adds a credible, demonstrable integration to the portfolio.
- (−) One more account/service and a Studio to maintain.
- (−) Need a webhook→rebuild wire-up (one-time setup).

---

## ADR-003 — Host on Cloudflare Pages

**Status:** Proposed · **Date:** 2026-06-30

**Decision:** Deploy the static build to **Cloudflare Pages**, connected to the GitHub repo (push to `main` = deploy; PRs get preview URLs). A Sanity webhook triggers production rebuilds on publish.

**Why:** Free tier with **unlimited bandwidth**, generous build allowance, commercial use permitted, global edge, and no surprise overage bills. (Details and comparison in the services doc.)

**Alternatives:** Netlify (also free, commercial-OK, but metered bandwidth). Vercel (best Next.js DX, but the free Hobby plan **forbids commercial use** and meters bandwidth — fine if the site is strictly personal, riskier otherwise). GitHub Pages (free but static-only, no build-side function/webhook flexibility).

**Consequences:** (+) effectively $0 at any realistic portfolio traffic, no lock-in. (−) If you later need Next.js-specific server features, Vercel is smoother; not relevant for an Astro static build.

---

## ADR-004 — Styling with Tailwind CSS v4, theme expressed as design tokens

**Status:** Proposed · **Date:** 2026-06-30

**Decision:** **Tailwind CSS v4** via the official `@tailwindcss/vite` plugin, with the theme defined **CSS-first** using `@theme` and CSS custom properties (design tokens). Tokens are the single source of truth; Tailwind utilities and any hand-written CSS both read from them. Dark mode = swapping token values on a `[data-theme]` attribute.

**Why:** Matches your existing skillset; v4's CSS-first config keeps the whole theme in one place (great for a token-driven site); tiny output. Tokens-as-CSS-vars makes the live "design token playground" demo trivial and keeps the colophon page honest.

**Alternatives:** UnoCSS (faster/atomic, Tailwind-compatible syntax) — viable, less familiar. Vanilla CSS + Open Props — clean, but you lose utility velocity. Plain CSS Modules — more boilerplate.

**Consequences:** (+) one source of truth for theme; effortless theming demo; small CSS. (−) v4 is config-in-CSS, slightly different from v3 muscle memory.

---

## ADR-005 — Rendering strategy: static generation + webhook rebuilds

**Status:** Proposed · **Date:** 2026-06-30

**Decision:** **Static Site Generation (SSG).** Pages are pre-rendered at build time from Sanity content. Publishing content triggers a webhook → Cloudflare rebuild. Interactive demos are client-side islands hydrated in the browser.

**Why:** Fastest possible delivery, cheapest hosting, simplest mental model, perfect for content that changes a few times a day. Avoids running/paying for a server.

**Alternatives:** SSR/ISR (needed only if content must be instant-fresh on every request — overkill here and pushes you toward metered compute). On-demand rendering for a couple of routes can be added later if a demo needs a server endpoint (Cloudflare Worker).

**Consequences:** (+) trivial cost, top performance. (−) a publish isn't *instant* (a build runs first — typically 1–3 min). Acceptable for a blog.

---

## ADR-006 — Repository & code structure: feature-based, typed, single repo

**Status:** Proposed · **Date:** 2026-06-30

**Decision:** One Git repo. Organize by **feature/domain**, not by file-type. Strict TypeScript. Content schema types generated from Sanity. Conventional commits. CI runs typecheck + lint + build on every PR.

```
/
├─ src/
│  ├─ content/            # collection configs / Sanity client + queries + generated types
│  ├─ layouts/
│  ├─ pages/              # routes (Astro)
│  ├─ features/
│  │  ├─ blog/            # components, utils, types scoped to blog
│  │  ├─ work/
│  │  └─ playground/
│  │     ├─ _registry.ts  # one place that lists every demo (id, title, framework, loader)
│  │     ├─ color-contrast/   (Vue island)
│  │     └─ token-studio/     (React island)
│  ├─ components/         # cross-feature primitives (Button, Prose, ThemeToggle…)
│  ├─ styles/             # global.css with @theme tokens
│  └─ lib/                # framework-agnostic helpers
├─ studio/                # Sanity Studio (or /sanity) — schemas in TS
├─ docs/                  # these documents
└─ public/
```

**Why:** Mirrors how you already like to work (refactor-friendly, architecture-first). A demo **registry** keeps the Playground open/closed-principle friendly — add a folder + one registry entry, nothing else changes.

**Consequences:** (+) scales as demos/posts grow; easy to reason about; great talking point. (−) a little upfront structure before the first feature ships (worth it).
