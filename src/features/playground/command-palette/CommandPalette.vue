<script setup lang="ts">
import Fuse from 'fuse.js';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

interface Command {
  id: string;
  title: string;
  group: 'Pages' | 'Posts' | 'Demos' | 'Actions';
  href?: string;
}

const COMMANDS: Command[] = [
  { id: 'home', title: 'Home', group: 'Pages', href: '/' },
  { id: 'work', title: 'Work & Experience', group: 'Pages', href: '/work' },
  { id: 'blog', title: 'Blog', group: 'Pages', href: '/blog' },
  { id: 'about', title: 'About', group: 'Pages', href: '/about' },
  { id: 'colophon', title: 'Colophon', group: 'Pages', href: '/colophon' },
  { id: 'playground', title: 'Playground', group: 'Pages', href: '/playground' },
  { id: 'd1', title: 'Design Token Studio', group: 'Demos', href: '/playground/token-studio' },
  {
    id: 'd2',
    title: 'Contrast & A11y Checker',
    group: 'Demos',
    href: '/playground/color-contrast',
  },
  { id: 'd3', title: 'Command Palette ⌘K', group: 'Demos', href: '/playground/command-palette' },
  { id: 'd4', title: 'The States Quartet', group: 'Demos', href: '/playground/states-quartet' },
  {
    id: 'p1',
    title: 'The four states every async UI owes its users',
    group: 'Posts',
    href: '/blog/four-states-async-ui',
  },
  {
    id: 'p2',
    title: 'Put focus management on your component checklist',
    group: 'Posts',
    href: '/blog/focus-management-checklist',
  },
  {
    id: 'p3',
    title: 'Feature folders beat layer folders',
    group: 'Posts',
    href: '/blog/feature-folders-vs-layer-folders',
  },
  {
    id: 'p4',
    title: 'useEffect through Vue eyes',
    group: 'Posts',
    href: '/blog/useeffect-through-vue-eyes',
  },
  {
    id: 'p5',
    title: 'TIL: color-mix() makes token washes free',
    group: 'Posts',
    href: '/blog/til-color-mix-token-washes',
  },
  { id: 'a1', title: 'Toggle dark / light theme', group: 'Actions' },
  { id: 'a2', title: 'Copy current URL', group: 'Actions' },
  { id: 'a3', title: 'Open RSS feed', group: 'Actions', href: '/rss.xml' },
];

const open = ref(false);
const query = ref('');
const activeIndex = ref(0);
const inputEl = ref<HTMLInputElement | null>(null);
const dialogEl = ref<HTMLDivElement | null>(null);
let previouslyFocused: HTMLElement | null = null;

const fuse = new Fuse(COMMANDS, { keys: ['title', 'group'], threshold: 0.4 });

const results = computed<Command[]>(() =>
  query.value.trim() ? fuse.search(query.value).map((r) => r.item) : COMMANDS,
);

const grouped = computed(() => {
  const groups = new Map<string, { command: Command; index: number }[]>();
  results.value.forEach((command, index) => {
    const list = groups.get(command.group) ?? [];
    list.push({ command, index });
    groups.set(command.group, list);
  });
  return groups;
});

watch(results, () => {
  activeIndex.value = 0;
});

async function openPalette() {
  previouslyFocused = document.activeElement as HTMLElement | null;
  open.value = true;
  query.value = '';
  activeIndex.value = 0;
  await nextTick();
  inputEl.value?.focus();
}

function closePalette() {
  open.value = false;
  previouslyFocused?.focus();
}

function run(command: Command) {
  closePalette();
  if (command.id === 'a1') {
    const root = document.documentElement;
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    return;
  }
  if (command.id === 'a2') {
    navigator.clipboard.writeText(location.href);
    return;
  }
  if (command.href) location.assign(command.href);
}

function onGlobalKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    open.value ? closePalette() : openPalette();
  }
}

function onDialogKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault();
    closePalette();
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    activeIndex.value = Math.min(activeIndex.value + 1, results.value.length - 1);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    activeIndex.value = Math.max(activeIndex.value - 1, 0);
  } else if (e.key === 'Enter') {
    e.preventDefault();
    const command = results.value[activeIndex.value];
    if (command) run(command);
  } else if (e.key === 'Tab') {
    // Focus trap: the search input is the only tabbable control.
    e.preventDefault();
    inputEl.value?.focus();
  }
}

onMounted(() => document.addEventListener('keydown', onGlobalKeydown));
onBeforeUnmount(() => document.removeEventListener('keydown', onGlobalKeydown));
</script>

<template>
  <div class="cp">
    <p class="cp-note">
      Press <kbd>⌘K</kbd> / <kbd>Ctrl+K</kbd> anywhere on this page, or use the button.
      Arrow keys navigate, <kbd>Enter</kbd> runs, <kbd>Esc</kbd> closes.
    </p>
    <button type="button" class="btn" @click="openPalette">Open palette ⌘K</button>

    <Teleport to="body">
      <div v-if="open" class="cp-overlay" @click.self="closePalette">
        <div
          ref="dialogEl"
          class="cp-dialog"
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          @keydown="onDialogKeydown"
        >
          <input
            ref="inputEl"
            v-model="query"
            class="cp-input"
            type="text"
            placeholder="Search pages, posts, demos…"
            role="combobox"
            aria-expanded="true"
            aria-controls="cp-listbox"
            :aria-activedescendant="results[activeIndex] ? `cp-item-${results[activeIndex].id}` : undefined"
          />
          <div v-if="results.length === 0" class="cp-empty">No matches; try a shorter query.</div>
          <ul v-else id="cp-listbox" class="cp-list" role="listbox">
            <template v-for="[group, items] in grouped" :key="group">
              <li class="cp-group" role="presentation">{{ group }}</li>
              <li
                v-for="{ command, index } in items"
                :id="`cp-item-${command.id}`"
                :key="command.id"
                role="option"
                :aria-selected="index === activeIndex"
                :class="['cp-item', { active: index === activeIndex }]"
                @click="run(command)"
                @mousemove="activeIndex = index"
              >
                {{ command.title }}
              </li>
            </template>
          </ul>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.cp-note { color: var(--ink-muted); max-width: 56ch; margin-bottom: 1.2rem; }
kbd {
  font-family: var(--font-mono);
  font-size: .78em;
  border: 1px solid var(--line);
  border-bottom-width: 2px;
  border-radius: var(--radius-1);
  padding: .1em .45em;
  background: var(--surface);
}
</style>

<style>
/* Unscoped: teleported to <body>. */
.cp-overlay {
  position: fixed;
  inset: 0;
  background: color-mix(in oklch, var(--ink) 30%, transparent);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 14vh;
  z-index: 100;
}
.cp-dialog {
  width: min(560px, calc(100vw - 2rem));
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-seal);
  overflow: hidden;
}
.cp-input {
  width: 100%;
  border: 0;
  border-bottom: 1px solid var(--line);
  background: transparent;
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 1rem;
  padding: 1rem 1.2rem;
  min-height: 44px;
}
.cp-input:focus-visible { outline-offset: -3px; }
.cp-list {
  list-style: none;
  margin: 0;
  padding: .4rem;
  max-height: 320px;
  overflow-y: auto;
}
.cp-group {
  font-family: var(--font-mono);
  font-size: .64rem;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--ink-muted);
  padding: .7rem .8rem .3rem;
}
.cp-item {
  padding: .55rem .8rem;
  cursor: pointer;
  border-radius: var(--radius-1);
  min-height: 44px;
  display: flex;
  align-items: center;
}
.cp-item.active {
  background: var(--shu-soft);
  color: var(--shu-strong);
}
.cp-empty {
  padding: 1.4rem 1.2rem;
  color: var(--ink-muted);
}
</style>
