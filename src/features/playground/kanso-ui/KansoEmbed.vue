<script setup lang="ts">
/**
 * Live kanso-ui components, iframed from the library's own docs site.
 *
 * The embed routes (kansoui.caioalfonso.dev/embed/<component>/) exist for exactly
 * this: no nav, no sidebar, transparent background, and a `?theme=` parameter
 * so the frame matches whatever this page is wearing. Nothing is vendored and
 * there is no build dependency on the packages — the portfolio links, it does
 * not merge.
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const components = [
  { id: 'switch', label: 'Switch' },
  { id: 'tabs', label: 'Tabs' },
  { id: 'dialog', label: 'Dialog' },
  { id: 'menu', label: 'Menu' },
  { id: 'field', label: 'Field' },
  { id: 'button', label: 'Button' },
  { id: 'card', label: 'Card' },
] as const;

const selected = ref<(typeof components)[number]['id']>('switch');
const theme = ref<'light' | 'dark'>('light');

// The trailing slash is load-bearing: without it the docs site answers 308 and
// the iframe pays for a redirect on every switch.
const src = computed(
  () => `https://kansoui.caioalfonso.dev/embed/${selected.value}/?theme=${theme.value}`,
);

const label = computed(
  () => components.find((c) => c.id === selected.value)?.label ?? selected.value,
);

/**
 * Follow the host page's theme.
 *
 * The embed route reads `?theme=` once, at load, so changing it changes the
 * iframe's src and reloads the frame. That is the honest trade for a
 * cross-origin embed and it is cheap — a theme toggle is a rare event, and the
 * alternative is a postMessage channel on both sides for one string.
 */
let observer: MutationObserver | undefined;

const readTheme = () => {
  theme.value = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
};

onMounted(() => {
  readTheme();
  observer = new MutationObserver(readTheme);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
});

onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <div class="kanso-embed">
    <!--
      A radio group, not a hand-rolled tablist. Native radios come with arrow-key
      navigation, a single tab stop and correct announcement for free — which is
      the argument the library itself makes about not reimplementing what the
      platform already ships.
    -->
    <fieldset class="picker">
      <legend>Component</legend>
      <label v-for="component in components" :key="component.id" class="chip">
        <input
          v-model="selected"
          type="radio"
          name="kanso-component"
          :value="component.id"
        />
        <span>{{ component.label }}</span>
      </label>
    </fieldset>

    <iframe
      :src="src"
      :title="`kanso-ui ${label} — live Vue and React examples`"
      class="frame"
      loading="lazy"
    />

    <p class="caption">
      Both panels inside the frame are the same core. The Vue island and the
      React island share every keyboard handler, every ARIA attribute and every
      state transition — only the rendering differs.
    </p>
  </div>
</template>

<style scoped>
.kanso-embed {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.picker {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  border: 0;
  padding: 0;
  margin: 0;
}

.picker legend {
  float: left;
  width: 100%;
  margin-bottom: 0.6rem;
  font-size: var(--text-step--1, 0.8125rem);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-muted);
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.7rem;
  border: 1px solid var(--rule, currentColor);
  cursor: pointer;
  font-size: var(--text-step--1, 0.875rem);
  line-height: 1.4;
}

/* The input stays in the layout and keeps its native focus ring. Hiding it
   would mean rebuilding focus visibility by hand, which is the bug this whole
   library exists to avoid. */
.chip:has(input:checked) {
  border-color: var(--accent, currentColor);
  color: var(--accent, inherit);
}

.chip:has(input:focus-visible) {
  outline: 2px solid var(--accent, currentColor);
  outline-offset: 2px;
}

.frame {
  width: 100%;
  min-height: 26rem;
  border: 1px solid var(--rule, currentColor);
  background: transparent;
  color-scheme: normal;
}

.caption {
  max-width: 68ch;
  margin: 0;
  color: var(--ink-muted);
  line-height: 1.75;
}
</style>
