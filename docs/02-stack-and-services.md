# 02 — Stack, Services & Costs

**Last updated:** 2026-06-30. Free-tier limits change — verify on each provider's pricing page before relying on them. Figures below reflect what was published as of mid-2026.

---

## 1. The stack at a glance

| Layer | Choice | Why |
|---|---|---|
| Framework / SSG | **Astro 6** | Content-first, islands, ~0 JS on content pages |
| Interactive islands | **Vue 3** (primary) + **React 19** (to showcase) | Shows your range in one repo |
| Language | **TypeScript** (strict) | Type-safe content + components |
| Styling | **Tailwind CSS v4** (`@tailwindcss/vite`) + CSS-var tokens | One source of truth for the theme |
| Content | **Sanity** (headless CMS, free tier) | Publish without code; demonstrable integration |
| Validation | **Zod** | Validate content & form inputs at the edge of the system |
| Rich text | **Portable Text** (Sanity) → rendered to HTML | Structured, safe, flexible |
| Hosting / CDN | **Cloudflare Pages** | Free, unlimited bandwidth, commercial-OK |
| Source control / CI | **GitHub** + GitHub Actions (or Cloudflare's build) | Free; PR previews |
| Analytics | **Cloudflare Web Analytics** or **Plausible CE** (self-host) | Privacy-friendly, free |
| Email/contact (later) | mailto + a form via **Web3Forms / Formspree** free tier, or a Cloudflare Worker | No backend to run |

**Toolchain:** Vite (built into Astro), ESLint (flat config) + Prettier *or* Biome (one tool, faster), Vitest for unit, Playwright for a couple of smoke/a11y tests, `astro check` for types.

### Current versions to target (mid-2026)
- Astro **6.x** (Tailwind v4 supported via the Vite plugin since Astro 5.2; v6 is current).
- Tailwind CSS **v4.3** — use `@tailwindcss/vite`, **not** the deprecated `@astrojs/tailwind` integration.
- Sanity Studio **v4** / current.
- *(If you go the Nuxt route instead:* Nuxt **4** with the `app/` directory, Nuxt UI **v4** — now fully open-source and free, Tailwind v4 via the Vite plugin.)*

---

## 2. Services & accounts to create

1. **GitHub** — repo + CI. *Free.*
2. **Cloudflare** — Pages (hosting), DNS, Web Analytics. *Free.*
3. **Sanity** — content store + Studio. *Free tier.*
4. **A domain registrar** — Cloudflare Registrar (at-cost), Porkbun, or Namecheap. *~US$10–15/yr.*
5. *(Optional)* **Plausible** if self-hosting analytics, or use Cloudflare's. *Free / self-host.*
6. *(Optional, later)* a form service for the contact form.

---

## 3. Cost breakdown (target: only the domain)

| Item | Plan | Monthly | Notes |
|---|---|---|---|
| Cloudflare Pages | Free | $0 | Unlimited bandwidth; ~500 builds/month; commercial use allowed; no overage bills |
| Sanity | Free | $0 | ~2 datasets, ~2–3 non-admin editors, ~500K API-CDN requests/mo, ~10 GB bandwidth, ~10K documents — runs in production indefinitely |
| GitHub | Free | $0 | Public or private repo + Actions minutes |
| Cloudflare Web Analytics | Free | $0 | Privacy-friendly, no cookie banner needed |
| Domain | — | ~$1/mo | ~$10–15/year, the one real cost |
| **Total** | | **≈ $1/mo** | Essentially just the domain |

### Why not Vercel/Netlify for hosting?
- **Vercel Hobby** is excellent for Next.js DX but its free tier **prohibits commercial use** and meters bandwidth (≈100 GB) — fine for a strictly personal site, a liability if you ever monetize or it goes viral.
- **Netlify** free allows commercial use but **meters bandwidth** (overages get pricey).
- **Cloudflare Pages** has **unlimited bandwidth on every tier** and allows commercial use, so a popular post can't generate a surprise bill. That's the deciding factor for "as cheap as possible."

### Will the Sanity free tier be enough?
For a personal portfolio + daily blog: comfortably. Documents stay well under the cap (a year of daily posts ≈ 365 docs vs a ~10K limit). The one number to watch is **API requests** — keep them near zero by **fetching content at build time (SSG)** rather than on every page view. With SSG you only hit Sanity during builds, so request volume is tiny.

---

## 4. Content schema (Sanity)

TypeScript-defined schemas. Field types abbreviated.

### `profile` (singleton — site-level copy, so edits never need a deploy)
```ts
{
  name: string
  headline: string            // the one-line hero claim
  bio: portableText
  location: string
  email: string
  socials: { label: string; url: url }[]
  cv: file                    // downloadable PDF
  availableForWork: boolean
}
```

### `post`
```ts
{
  title: string
  slug: slug                  // from title
  publishedAt: datetime
  updatedAt?: datetime
  excerpt: text               // ≤ 200 chars, used in lists + meta description
  cover?: image               // with alt (required when present)
  tags: string[]
  series?: reference -> series
  body: portableText          // code blocks, images, callouts
  draft: boolean
  // derived at build: readingTime, wordCount, ogImage
}
```

### `project`
```ts
{
  title: string
  slug: slug
  role: string
  period: string              // "2023–2024"
  stack: string[]             // ["Vue", "Nuxt", "TypeScript"]
  summary: text
  body: portableText
  links: { label: string; url: url }[]   // live, repo, case study
  cover?: image
  featured: boolean
  order: number
}
```

### `experience` (drives the timeline)
```ts
{
  company: string
  role: string
  start: date
  end?: date                  // null/absent = "Present"
  location?: string
  highlights: string[]
  order: number
}
```

### `series` (optional, for daily-cadence organization)
```ts
{ title: string; slug: slug; description: text; accentToken?: string }
```

> **Validation:** mirror these as **Zod** schemas on the app side; fail the build if Sanity returns content that doesn't match (e.g. an image without alt text). This keeps a11y and data quality enforced by the type system, not by vigilance.

---

## 5. Publish pipeline (no-code, no manual deploy)

```
Author writes/edits in Sanity Studio  ──publish──▶  Sanity content lake
                                                         │  (webhook on publish)
                                                         ▼
                                          Cloudflare Pages Deploy Hook
                                                         │  (rebuild)
                                                         ▼
                                   Astro fetches content at build time → static HTML
                                                         │
                                                         ▼
                                        Live on the edge in ~1–3 minutes
```

Code changes follow the normal path: push to `main` → Cloudflare builds → deploy; every PR gets a preview URL.

---

## 6. Environment & config

- `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_VERSION`, read-only `SANITY_READ_TOKEN` (build-time only) → stored as Cloudflare Pages build env vars and in a local `.env` (git-ignored).
- Sanity webhook secret + Cloudflare Deploy Hook URL stored in Sanity/Cloudflare dashboards.
- Never expose write tokens to the client; the site reads published content only.

---

## 7. Quality gates (CI)

On every PR: `astro check` (types) → lint → `astro build` → Playwright smoke + axe a11y check on key routes. Block merge on failure. Lighthouse CI (optional) can post scores to the PR so regressions are visible.
