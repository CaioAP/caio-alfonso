<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  contrastRatio,
  hexToRgb,
  rgbToHex,
  suggestFix,
  wcagRating,
  wcagRatingLarge,
} from '../../../lib/color';

const fg = ref('#6d665b');
const bg = ref('#f5f3ed');

const ratio = computed(() => {
  const f = hexToRgb(fg.value);
  const b = hexToRgb(bg.value);
  if (!f || !b) return null;
  return contrastRatio(f, b);
});

const normal = computed(() => (ratio.value ? wcagRating(ratio.value) : null));
const large = computed(() => (ratio.value ? wcagRatingLarge(ratio.value) : null));

const fix = computed(() => {
  if (!ratio.value || ratio.value >= 4.5) return null;
  const f = hexToRgb(fg.value);
  const b = hexToRgb(bg.value);
  if (!f || !b) return null;
  const fixed = suggestFix(f, b, 4.5);
  return fixed ? rgbToHex(fixed) : null;
});

function applyFix() {
  if (fix.value) fg.value = fix.value;
}
function swap() {
  [fg.value, bg.value] = [bg.value, fg.value];
}
</script>

<template>
  <div class="cc">
    <p class="cc-note">
      Pick a text color and a background. The verdict is the WCAG 2.2 contrast ratio:
      AA needs 4.5:1 for normal text, 3:1 for large text.
    </p>

    <div class="cc-inputs">
      <label class="cc-field">
        <span>Text color</span>
        <input v-model="fg" type="color" />
        <code>{{ fg }}</code>
      </label>
      <button type="button" class="btn cc-swap" aria-label="Swap colors" @click="swap">⇄</button>
      <label class="cc-field">
        <span>Background</span>
        <input v-model="bg" type="color" />
        <code>{{ bg }}</code>
      </label>
    </div>

    <div class="cc-preview" :style="{ background: bg, color: fg }">
      <p class="cc-large">Large heading text</p>
      <p class="cc-normal">Normal body text at regular size: the harder test to pass.</p>
    </div>

    <div v-if="ratio" class="cc-verdict" aria-live="polite">
      <span class="cc-ratio">{{ ratio.toFixed(2) }}:1</span>
      <span class="cc-badge" :data-rating="normal">normal text · {{ normal }}</span>
      <span class="cc-badge" :data-rating="large">large text · {{ large }}</span>
    </div>

    <div v-if="fix" class="cc-fix">
      <p>
        Fails AA for normal text. Nearest passing text color:
        <code>{{ fix }}</code>
        <span class="cc-fix-swatch" :style="{ background: fix }" aria-hidden="true" />
      </p>
      <button type="button" class="btn" @click="applyFix">Apply fix</button>
    </div>
  </div>
</template>

<style scoped>
.cc { max-width: 640px; }
.cc-note { color: var(--ink-muted); max-width: 56ch; }
.cc-inputs { display: flex; gap: 1.2rem; align-items: flex-end; flex-wrap: wrap; margin-top: 1.6rem; }
.cc-field { display: flex; flex-direction: column; gap: .4rem; font-family: var(--font-mono); font-size: .76rem; color: var(--ink-muted); }
.cc-field input[type="color"] { width: 88px; height: 44px; padding: 2px; border: 1px solid var(--line); background: var(--surface); border-radius: var(--radius-1); cursor: pointer; }
.cc-swap { min-height: 44px; }
.cc-preview { border: 1px solid var(--line); padding: 1.6rem; margin-top: 1.6rem; }
.cc-large { font-family: var(--font-display); font-size: 1.6rem; font-weight: 700; margin: 0; }
.cc-normal { margin: .6rem 0 0; }
.cc-verdict { display: flex; gap: .8rem; align-items: center; flex-wrap: wrap; margin-top: 1.2rem; }
.cc-ratio { font-family: var(--font-mono); font-size: 1.3rem; font-weight: 500; }
.cc-badge { font-family: var(--font-mono); font-size: .74rem; border: 1px solid var(--line); padding: .35rem .7rem; }
.cc-badge[data-rating="FAIL"] { border-color: var(--shu); color: var(--shu-strong); }
.cc-fix { margin-top: 1.2rem; display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; }
.cc-fix p { margin: 0; color: var(--ink-muted); }
.cc-fix-swatch { display: inline-block; width: 14px; height: 14px; border: 1px solid var(--line); vertical-align: middle; margin-left: .3rem; }
</style>
