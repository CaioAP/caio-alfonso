<script setup lang="ts">
import { ref } from 'vue';

defineProps<{ tags: string[] }>();
const active = ref<string | null>(null);

function toggle(tag: string) {
  active.value = active.value === tag ? null : tag;
  // Filter server-rendered .post-row elements by data-tags attribute.
  for (const el of document.querySelectorAll<HTMLElement>('.post-row')) {
    const tags = el.dataset.tags?.split(',') ?? [];
    el.style.display = !active.value || tags.includes(active.value) ? '' : 'none';
  }
}
</script>

<template>
  <div class="tag-filter" role="group" aria-label="Filter by tag">
    <button
      v-for="tag in tags"
      :key="tag"
      type="button"
      :class="['chip', active === tag ? 'chip-lead' : '']"
      :aria-pressed="active === tag"
      @click="toggle(tag)"
    >{{ tag }}</button>
  </div>
</template>

<style scoped>
.tag-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.6rem;
}
.chip {
  cursor: pointer;
  background: transparent;
  min-height: 44px;
}
</style>
