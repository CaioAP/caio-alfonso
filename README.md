# Portfolio — Specification Bundle

Planning docs for Caio's portfolio + daily frontend blog. Read in order.

| Doc | What's inside |
|---|---|
| [`00-project-spec.md`](docs/00-project-spec.md) | Goals, non-goals, audience, IA, requirements, success criteria, open questions |
| [`01-architecture-decisions.md`](docs/01-architecture-decisions.md) | ADRs: framework, CMS, hosting, styling, rendering, repo structure |
| [`02-stack-and-services.md`](docs/02-stack-and-services.md) | Full stack, services, **cost breakdown**, content schema, publish pipeline |
| [`03-design-system.md`](docs/03-design-system.md) | Theme concept, **design tokens**, typography, `global.css`, a11y |
| [`04-showcase-and-blog-backlog.md`](docs/04-showcase-and-blog-backlog.md) | **Playground demo ideas** + **blog series & topic backlog** |
| [`05-delivery-roadmap.md`](docs/05-delivery-roadmap.md) | Phased plan, first-week plan, definitions of done |
| `prototype.html` | A live, self-contained visual preview of the design |

## TL;DR of the recommendation
- **Astro** shell + **Vue & React islands** (shows your range in one repo) · **TypeScript** · **Tailwind v4** with token-based theming. ✓ *confirmed*
- Content in **Sanity** (free) → publish with no code, no manual deploy. ✓ *confirmed*
- Hosted on **Cloudflare Pages** (free, unlimited bandwidth). Only real cost: a domain (~$10–15/yr).
- Design: **"余白 / Yohaku"** — a Japanese-minimalist direction built on *ma* (negative space), *kanso* and *shibui*. Signature: a vermilion **hanko seal** that stamps onto the page. Washi off-white ↔ warm sumi charcoal, Zen Old Mincho + Zen Kaku Gothic New type, tategaki vertical labels. See doc 03.

## Decisions locked (2026-06-30)
1. **Framework:** Astro + Vue/React islands. ✓
2. **Content:** managed Sanity. ✓

## Still to confirm
- **Domain** name to register.
- **v1 scope:** ship Home + Blog + 3 demos first, or hold for the full set?
