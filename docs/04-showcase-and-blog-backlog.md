# 04 — Playground Ideas & Blog Backlog

This is the "what to build and what to write" doc. The Playground demos are your *proof*; the blog is your *voice*. Both are designed so each piece is small, finishable, and points back at your strengths: usability, architecture, Vue/Nuxt, and the React learning arc.

---

## Part A — Playground: interactive demos to build

Each demo is an isolated island, listed in `features/playground/_registry.ts`. Tiered by effort→impact. The **Framework** column is a suggestion for which stack to *showcase* with each (deliberately mixing Vue and React).

### Tier 1 — high impact, low effort (ship these first)
| # | Demo | What it shows | Framework |
|---|---|---|---|
| 1 | **Design Token Studio** | Live-edit the site's own color/space/radius tokens; see components update; export `global.css` / Tailwind `@theme`. *Meta: the site theming itself.* | React (showcase) |
| 2 | **Contrast & A11y Checker** | Paste/pick two colors → WCAG AA/AAA verdict, suggested fixes. Directly proves your usability claim. | Vue |
| 3 | **Command Palette (⌘K)** | Fuzzy-search navigation for the whole site. Delightful, keyboard-first UX. | Vue |
| 4 | **State Machine: a real form** | Multi-step form with validation, loading/empty/error/success states done *properly* (the thing most sites get wrong). | Vue |

### Tier 2 — meatier, great talking points
| # | Demo | What it shows | Framework |
|---|---|---|---|
| 5 | **Virtualized Data Table** | 50k rows, sort/filter/search, smooth scroll. Perf + data-handling. | React |
| 6 | **Drag-and-drop Kanban** | Reorder across columns, persistent (localStorage/IndexedDB). State architecture. | Vue |
| 7 | **Vue ↔ React, same component** | The *same* widget built in both, side by side, with annotated notes on the differences. Your range, made literal. | Vue + React |
| 8 | **Scroll/View-Transitions playground** | Modern CSS: `:has()`, container queries, View Transitions API micro-interactions. | Vanilla/Astro |

### Tier 3 — fun, shows depth / personality
| # | Demo | What it shows |
|---|---|---|
| 9 | **GitHub stats mashup** | Live contribution heatmap / repo stats via the GitHub API. API integration. |
| 10 | **Palette extractor** | Drop an image → pull its dominant colors (canvas). Neat utility. |
| 11 | **A tiny game** | Wordle clone / typing test / Conway's Life. JS logic + canvas/animation. |
| 12 | **This site's Web Vitals, live** | Show the portfolio's own Core Web Vitals in real time — proof, not promise. |

**Pattern for every demo page:** the demo up top, then a short *"How it's built"* note (the architecture decision, the gotcha you solved, the trade-off). That note is what turns a toy into evidence of seniority — and it doubles as a blog post.

---

## Part B — Blog: a system for daily posting

Daily cadence is only sustainable with **structure + a low-effort bucket**. Don't free-solo a new topic every morning.

### The system
- **Run in series.** A series gives you 5–15 pre-scoped posts, so each day is "next entry," not "blank page."
- **Mix lengths.** ~70% short (200–500 words, one idea). ~20% medium (a walkthrough). ~10% long (a deep dive, weekly).
- **Keep a "TIL" bucket** for low-energy days: one thing you learned today, 3–5 sentences. Always shippable.
- **Batch & schedule.** Write 3–4 on a good day; `publishedAt` in the future + a daily build (Cloudflare cron / scheduled deploy) releases them. Daily presence without daily writing.
- **Turn work into posts.** Every Playground "How it's built" note → a post. Every refactor → a "refactoring diary" entry.

### Series & topic backlog
Below is enough to cover ~2+ months without repeating yourself.

**Series 1 — Frontend Architecture (your wheelhouse)**
- Feature-based vs layer-based folder structure (and when each breaks)
- Designing a component's public API (props, events, slots) before its insides
- When to extract a component — and when extracting makes things worse
- Prop drilling vs provide/inject vs a store: a decision guide
- Container/presentational, 2026 edition — what survived, what didn't
- Separating UI from logic with composables/hooks
- A refactor in public: messy component → clean, narrated diff by diff
- Naming things: a practical taxonomy for components/composables/utils
- Error boundaries and the "states quartet" (loading/empty/error/success) as architecture

**Series 2 — UX & Usability (your differentiator)**
- The four states every async UI owes its users
- Forms that don't fight people: inline validation timing done right
- Focus management: the invisible feature that makes or breaks keyboard users
- Skeletons vs spinners: when each is honest
- Optimistic UI without lying to the user
- Microcopy: error messages that fix the problem instead of apologizing
- Designing empty states as invitations, not dead ends
- Reduced motion: respecting it without making the UI boring
- Touch targets, thumb zones, and mobile reality

**Series 3 — Learning React/Next in public (your growth story)**
- Hooks through Vue eyes: `useEffect` vs `watch`/`watchEffect`
- `useState` vs `ref`/`reactive`: mental-model translation
- The `useEffect` dependency trap a Vue dev walks straight into
- Server Components: what finally clicked
- Next App Router vs Nuxt: routing & data fetching compared
- Things I miss from Vue (and the React way to get them)
- Migrating one component from Nuxt to Next, step by step

**Series 4 — TypeScript for frontends**
- Typing component props & emits without fighting the compiler
- Discriminated unions to model UI state (kills impossible states)
- Generics in components, explained with a real `<List>`
- Zod + inferred types: one source of truth for runtime + compile time
- Utility types you'll actually reach for (`Pick`, `Omit`, `satisfies`)

**Series 5 — Modern CSS & Tailwind v4**
- Design tokens as CSS variables: the setup that scales
- Tailwind v4's CSS-first config: what changed and why it's better
- `:has()` — the parent selector and what it unlocks
- Container queries in practice
- View Transitions API for SPA-feel without an SPA
- Fluid type & space with `clamp()` (and a generator)

**Series 6 — Performance**
- Core Web Vitals, explained for people who ship
- Islands/partial hydration: ship less JS on purpose
- Image optimization that actually moves LCP
- Virtualizing long lists without jank
- Measuring before optimizing: a Lighthouse/DevTools workflow

**Series 7 — Tooling & workflow**
- ESLint flat config (or Biome): a clean 2026 setup
- A pragmatic testing pyramid for frontend (Vitest + Playright + axe)
- Conventional commits + a tidy PR template
- Setting up CI that catches a11y and perf regressions

**"TIL" / evergreen short bucket (low-energy days):** a CSS trick, a DevTools feature, a keyboard shortcut, a small a11y win, a TS one-liner, a Vue/React API you forgot existed.

> **Tip:** title posts as the *answer*, not the topic ("Put focus management on your component checklist," not "About focus"). It reads better in lists and in search.
