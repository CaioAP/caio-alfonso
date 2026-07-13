import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://caio.dev', // replace with real domain
  output: 'static',
  integrations: [vue(), react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
