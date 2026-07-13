<script setup lang="ts">
import { ref } from 'vue';

type UiState =
  | { kind: 'loading' }
  | { kind: 'empty' }
  | { kind: 'error'; message: string }
  | { kind: 'success'; items: { id: number; title: string; date: string }[] };

const DEMO_ITEMS = [
  { id: 1, title: 'The four states every async UI owes its users', date: '07/10' },
  { id: 2, title: 'Put focus management on your component checklist', date: '07/09' },
  { id: 3, title: 'Feature folders beat layer folders', date: '07/08' },
];

const state = ref<UiState>({ kind: 'loading' });

const buttons = [
  { kind: 'loading', label: 'Loading' },
  { kind: 'empty', label: 'Empty' },
  { kind: 'error', label: 'Error' },
  { kind: 'success', label: 'Success' },
] as const;

function show(kind: (typeof buttons)[number]['kind']) {
  switch (kind) {
    case 'loading':
      state.value = { kind: 'loading' };
      break;
    case 'empty':
      state.value = { kind: 'empty' };
      break;
    case 'error':
      state.value = { kind: 'error', message: 'The posts service timed out after 5 seconds.' };
      break;
    case 'success':
      state.value = { kind: 'success', items: DEMO_ITEMS };
      break;
  }
}

function retry() {
  state.value = { kind: 'loading' };
  setTimeout(() => {
    state.value = { kind: 'success', items: DEMO_ITEMS };
  }, 900);
}
</script>

<template>
  <div class="sq">
    <p class="sq-note">
      One widget, four honest states — modeled as a discriminated union so impossible
      combinations don't compile. Toggle them manually:
    </p>

    <div class="sq-controls" role="group" aria-label="Switch widget state">
      <button
        v-for="b in buttons"
        :key="b.kind"
        type="button"
        :class="['chip', state.kind === b.kind ? 'chip-lead' : '']"
        :aria-pressed="state.kind === b.kind"
        @click="show(b.kind)"
      >{{ b.label }}</button>
    </div>

    <div class="sq-stage" aria-live="polite">
      <!-- Loading: skeleton preserves layout, no spinner-only -->
      <div v-if="state.kind === 'loading'" class="sq-skeleton" aria-label="Loading posts">
        <div v-for="i in 3" :key="i" class="sq-skel-row">
          <span class="sq-skel sq-skel-date"></span>
          <span class="sq-skel sq-skel-title"></span>
        </div>
      </div>

      <!-- Empty: an invitation, not a dead end -->
      <div v-else-if="state.kind === 'empty'" class="sq-empty">
        <p class="sq-empty-title">No posts yet</p>
        <p>When the first post is published it will show up here. Meanwhile:</p>
        <button type="button" class="btn" @click="show('success')">Browse sample posts</button>
      </div>

      <!-- Error: human message + retry -->
      <div v-else-if="state.kind === 'error'" class="sq-error" role="alert">
        <p class="sq-error-title">Couldn't load the posts</p>
        <p>{{ state.message }} Your connection looks fine — it's on our side.</p>
        <button type="button" class="btn" @click="retry">Try again</button>
      </div>

      <!-- Success: the data -->
      <ul v-else class="sq-list">
        <li v-for="item in state.items" :key="item.id">
          <span class="sq-date">{{ item.date }}</span>
          <span class="sq-title">{{ item.title }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.sq { max-width: 640px; }
.sq-note { color: var(--ink-muted); max-width: 56ch; }
.sq-controls { display: flex; gap: .5rem; flex-wrap: wrap; margin-top: 1.4rem; }
.sq-controls .chip { cursor: pointer; background: transparent; min-height: 44px; }
.sq-stage { border: 1px solid var(--line); margin-top: 1.4rem; padding: 1.4rem; min-height: 220px; }

.sq-skel-row { display: grid; grid-template-columns: 64px 1fr; gap: 1rem; padding: .9rem 0; border-bottom: 1px solid var(--line); }
.sq-skel { display: block; height: 1em; background: var(--surface-sunk); border-radius: var(--radius-1); }
.sq-skel-title { width: 80%; }
@media (prefers-reduced-motion: no-preference) {
  .sq-skel { animation: sq-pulse 1.4s ease-in-out infinite; }
  @keyframes sq-pulse { 0%, 100% { opacity: 1; } 50% { opacity: .45; } }
}

.sq-empty-title, .sq-error-title { font-family: var(--font-display); font-weight: 700; font-size: 1.15rem; margin: 0; }
.sq-empty p, .sq-error p { color: var(--ink-muted); margin: .5rem 0 1rem; }
.sq-error { border-left: 2px solid var(--shu); padding-left: 1rem; }

.sq-list { list-style: none; margin: 0; padding: 0; }
.sq-list li { display: grid; grid-template-columns: 64px 1fr; gap: 1rem; padding: .9rem 0; border-bottom: 1px solid var(--line); align-items: baseline; }
.sq-date { font-family: var(--font-mono); font-size: .76rem; color: var(--ink-muted); }
.sq-title { font-family: var(--font-display); font-weight: 700; }
</style>
