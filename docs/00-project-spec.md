# 00 — Project Specification

**Project:** Personal portfolio + daily frontend blog
**Owner:** Caio
**Status:** Draft v1 (for review)
**Last updated:** 2026-06-30

---

## 1. Purpose & thesis

A portfolio that proves three claims in under 30 seconds, then lets a visitor verify them by playing:

1. **I build usable interfaces.** Demonstrated, not asserted — the site itself is fast, accessible, and pleasant.
2. **I think in systems and architecture.** The site is literally built from a visible design-token system; the blog documents the thinking.
3. **I have range.** Vue/Nuxt is the home turf; the React/Next learning journey is shown in public.

The site is both the résumé *and* the work sample. Every interactive piece is a small, finished thing a stranger can poke at without reading a word.

## 2. Goals

- Present an identity, work history, and skills clearly and credibly.
- Host a **daily** short-form blog about frontend development.
- Embed a handful of **live, interactive demos** ("the Playground") that show real skill.
- Let the owner **publish projects and posts without touching code or redeploying by hand**.
- Run at **near-zero cost** (target: only a domain, ~US$10–15/year).
- Be a reference example of the owner's own standards (perf, a11y, code structure).

## 3. Non-goals (v1)

- No authentication / user accounts / comments system (link out to social for discussion).
- No e-commerce, payments, or paywall.
- No multi-author CMS workflow — single author.
- No heavy CMS for the *interactive demos*; those ship as code (they're the portfolio).
- No newsletter platform in v1 (designed for, added in a later phase — see roadmap).

## 4. Audience

| Audience | What they need from the site | Primary path |
|---|---|---|
| Hiring managers / recruiters | Fast credibility, experience, contact | Home → Work → Contact |
| Senior engineers / peers | Proof of craft, code quality, opinions | Home → Playground → Blog → GitHub |
| Potential freelance clients | "Can this person ship?" | Home → Work → Playground |
| The owner (future self) | A place to publish daily, low friction | Studio (CMS) → publish |

## 5. Content model

Three content types. (Field-level schema lives in `02-stack-and-services.md`.)

- **Post** — a blog entry. title, slug, publishedAt, tags[], excerpt, body (rich text/markdown), optional cover, optional series, readingTime (derived), draft flag.
- **Project / Work sample** — title, slug, role, period, stack[], summary, body, links (live/repo), cover, featured flag, order.
- **Experience** — company, role, start, end (nullable = current), location, highlights[], order. (Drives the chronological timeline.)

A small amount of content is **site-level** (bio, headline, social links, CV file) — kept as a single editable "Profile" document so copy changes never require a deploy.

## 6. Information architecture / pages

```
/                     Home (hero + about + featured work + featured demos + latest posts)
/work                 Work & experience (timeline + project cards)
/work/[slug]          Project case study
/playground           Grid of live interactive demos
/playground/[slug]    A single demo, full-bleed, with a "how it's built" note
/blog                 Post index (filter by tag / series)
/blog/[slug]          A post
/blog/series/[slug]   A series landing page (optional, phase 2)
/about                Longer bio + skills + contact + CV download
/uses or /colophon    The stack + design tokens of THIS site (a credibility flex)
/rss.xml, /sitemap.xml, /og/[slug].png  (generated)
```

## 7. Functional requirements

- **FR-1** Visitor can read any post/project with no JS required for content (JS enhances, never gates).
- **FR-2** Owner publishes a post from a web editor; it appears live within minutes, no manual deploy.
- **FR-3** Owner adds/edits a project the same way.
- **FR-4** Each Playground demo is independently loadable and shareable by URL.
- **FR-5** Blog supports tags and (optionally) series for daily-cadence organization.
- **FR-6** Site generates per-post Open Graph images automatically.
- **FR-7** Dark/light theme, remembered across visits, follows system preference by default.
- **FR-8** RSS feed (so a daily blog actually gets followed).

## 8. Non-functional requirements (the quality floor)

- **Performance:** Lighthouse ≥ 95 on all four categories for content pages; ship ~0 KB JS on pure content routes; interactive demos hydrate in isolation (islands).
- **Accessibility:** WCAG 2.2 AA. Visible keyboard focus, correct landmarks/heading order, `prefers-reduced-motion` respected, AA contrast on all token pairs (verified in the design doc).
- **SEO:** semantic HTML, canonical URLs, sitemap, structured data for articles, OG/Twitter meta.
- **Resilience:** content fetch failures at build time fail the build loudly, not silently.
- **Cost ceiling:** $0 platform cost on the chosen free tiers at expected traffic (see services doc).
- **Maintainability:** feature-based folder structure, typed content, lint + format + typecheck in CI.

## 9. Success criteria

- Owner can publish a post end-to-end from phone or laptop in < 3 minutes without a code change.
- A cold visitor reaches "I get who this is and what they're good at" within one screen.
- All content pages green on Core Web Vitals in the field (CrUX) after 28 days.
- At least 6 finished Playground demos and 20 published posts by end of phase 2.

## 10. Open questions (for the owner)

1. **Framework** — recommendation is Astro (shell) + Vue/React islands. Confirm, or prefer a pure Nuxt build? (See ADR-001.)
2. **Content source** — managed CMS (Sanity, recommended) vs. git-based (Content Collections + a UI editor)? (ADR-002.)
3. **Domain** — is there a preferred name to register?
4. **Scope of v1** — ship Home + Blog + 3 demos first, or wait for the full set?
