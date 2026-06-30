# 05 — Delivery Roadmap

A phased plan so the site is *live and useful early*, then deepens. Each phase ends with something shipped.

---

## Phase 0 — Foundations (½–1 day)
- Create accounts: GitHub, Cloudflare, Sanity, domain registrar.
- `npm create astro@latest` → add Vue + React integrations, Tailwind v4 via `@tailwindcss/vite`.
- Drop in `global.css` with the design tokens (from doc 03).
- Wire repo → Cloudflare Pages (auto-deploy on push, PR previews).
- Set up ESLint/Biome + Prettier + `astro check` + a minimal CI.
- **Ship:** a deployed "hello world" on the real domain, dark/light toggle working.

## Phase 1 — Content spine + blog (2–4 days)
- Stand up Sanity: `profile`, `post`, `project` schemas; deploy the Studio.
- Build layouts + the `Prose` component; `/blog` index and `/blog/[slug]`.
- Add the Sanity → Cloudflare deploy webhook.
- RSS, sitemap, OG image generation.
- Write 3–5 posts to season the blog.
- **Ship:** you can publish a post from the Studio with no code change. Blog is live.

## Phase 2 — Identity + work (2–3 days)
- Home page: hero (with the marker signature), about strip, featured work, latest posts.
- `/work` timeline (`experience`) + project cards; `/work/[slug]` case studies.
- `/about` with bio + skills + CV download + contact.
- **Ship:** a complete, credible portfolio a recruiter can read end-to-end.

## Phase 3 — Playground v1 (3–5 days)
- Build the `_registry.ts` pattern + `/playground` grid + `/playground/[slug]`.
- Ship **Tier-1** demos: Token Studio (React), Contrast Checker (Vue), Command Palette (Vue), Stateful Form (Vue).
- Each demo gets a "How it's built" note → reuse as blog posts.
- **Ship:** four live, pokeable demos proving range and craft.

## Phase 4 — Depth & polish (ongoing)
- Add Tier-2/3 demos over time (one per couple of weeks).
- `/colophon` ("how this site is built" + live tokens) — a credibility flex.
- Series landing pages; tag filtering; reading time.
- Lighthouse CI in PRs; field Core Web Vitals check after launch.

## Phase 5 — Optional later
- Newsletter (RSS-to-email via a free tier) for the daily blog.
- Scheduled publishing via a daily Cloudflare cron build (write ahead, release daily).
- i18n (PT-BR / EN) if you want reach in both markets.
- A contact form via a Worker or a free form service.

---

## Suggested first week
1. Phase 0 + Phase 1 spine → blog live, publishing from the Studio.
2. Write/queue 5 posts (one short series) to establish cadence.
3. Phase 2 home + work so the front door is real.
4. Start Phase 3 with the Token Studio demo (the most "you" piece).

## Definition of done (per content type)
- **Post:** has excerpt + tags, passes a11y/lint, OG image generated, renders with no layout shift.
- **Project:** has summary, stack, at least one link, a cover, and a short outcome line.
- **Demo:** keyboard-operable, reduced-motion safe, has a "How it's built" note, loads in isolation.
