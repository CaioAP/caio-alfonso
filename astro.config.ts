import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Drives canonical URLs, OG image URLs, RSS and sitemap entries.
  // Update when a custom domain is wired to the Pages project.
  site: 'https://caio-alfonso.pages.dev',
  output: 'static',
  integrations: [vue(), react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
