# Spec: Colophon (/colophon)

Documents how the site itself is built. A credibility flex: the stack is part of the portfolio. Includes live token demonstration (links to or embeds the Token Studio demo).

## File

```
src/pages/colophon.astro
```

## `src/pages/colophon.astro`

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Seal       from '../components/Seal.astro';

const stack = [
  { label: 'build',   value: 'Astro 6 · Vue 3 + React 19 islands' },
  { label: 'lang',    value: 'TypeScript (strict)' },
  { label: 'style',   value: 'Tailwind v4 · CSS-variable design tokens' },
  { label: 'content', value: 'Sanity — publish without a deploy' },
  { label: 'host',    value: 'Cloudflare Pages · ~$0' },
  { label: 'perf',    value: '~0 KB JS on content pages · Lighthouse ≥ 95' },
  { label: 'a11y',    value: 'WCAG 2.2 AA · axe clean · skip link · visible focus' },
  { label: 'type',    value: 'Zen Old Mincho · Zen Kaku Gothic New · JetBrains Mono' },
  { label: 'source',  value: 'github.com/caio/portfolio (replace with real URL)' },
];
---
<BaseLayout
  title="Colophon — Caio"
  description="How this site is made — stack, tools, and design decisions."
>
  <section class="band">
    <div class="wrap">
      <p class="eyebrow">Colophon</p>
      <h1 class="h2lead">How this site is made.</h1>
      <p class="lede">
        The stack is part of the portfolio. Every tool choice here is a
        deliberate one — made because it's the right fit, documented because
        it's the kind of thinking I want to show.
      </p>

      <!-- Stack record -->
      <div class="colophon-box">
        <dl>
          {stack.map(({ label, value }) => (
            <>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </>
          ))}
        </dl>
        <div class="seal-line">
          <Seal size="sm" />
        </div>
      </div>

      <!-- Live tokens link -->
      <div class="token-nudge">
        <p class="eyebrow" style="margin-top: 3rem;">Design tokens</p>
        <p>
          The color palette, typography, and spacing are all CSS custom properties —
          a single source of truth that both the Tailwind utilities and hand-written
          CSS read from. Try editing them live in the
          <a class="link" href="/playground/token-studio">Token Studio →</a>
        </p>
      </div>

      <!-- Design principles -->
      <div class="principles">
        <p class="eyebrow" style="margin-top: 3rem;">Design rationale</p>
        <p>
          The visual language is <em>Yohaku</em> (余白) — Japanese for intentional
          negative space. Restraint over decoration. Hairline rules over drop shadows.
          One accent color (vermilion seal) instead of a palette. The typography is
          Zen Old Mincho + Zen Kaku Gothic New: Japanese-lineage typefaces that carry
          Latin beautifully with structured, deliberate strokes.
        </p>
        <p>
          The only non-Latin character on the site is <strong>カ</strong> in the
          hanko seal — a katakana initial used as a logo mark, not cultural decoration.
        </p>
      </div>
    </div>
  </section>
</BaseLayout>

<style>
  .colophon-box {
    border: 1px solid var(--line);
    padding: clamp(20px, 4vw, 40px);
    max-width: 540px;
    margin-top: 2.4rem;
  }
  .colophon-box dl {
    margin: 0;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: .8rem 1.6rem;
    font-family: var(--font-mono);
    font-size: .82rem;
  }
  .colophon-box dt { color: var(--ink-faint); }
  .colophon-box dd { margin: 0; color: var(--ink); }
  .seal-line {
    display: flex;
    justify-content: flex-end;
    margin-top: 1.6rem;
    padding-top: 1.2rem;
    border-top: 1px solid var(--line);
  }

  .token-nudge p, .principles p {
    max-width: 65ch;
    color: var(--ink-muted);
    margin-top: .8rem;
    line-height: 1.75;
  }
</style>
```

## Definition of done

- Stack `dl` is complete and accurate (update when stack changes).
- Token Studio link points to the live demo.
- カ reference explains itself inline (non-Latin character acknowledged).
- Zero JS on this page (pure Astro, no islands).
- Passes axe.
