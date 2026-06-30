# Spec: Scaffold — Phase 0

Bootstraps the repo into a running Astro project with all integrations, toolchain, and CI wired.

## Init

```bash
npm create astro@latest . -- --template minimal --typescript strict --no-install
npm install
npx astro add vue react
```

## Dependencies

```bash
# Styling
npm i -D tailwindcss @tailwindcss/vite

# CMS
npm i @sanity/client @sanity/image-url

# Validation
npm i zod

# Testing
npm i -D vitest @vitest/coverage-v8 playwright @playwright/test @axe-core/playwright

# Linting
npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
# — OR —
npm i -D @biomejs/biome

# Astro extras
npm i @astrojs/sitemap @astrojs/rss
```

## `astro.config.ts`

```ts
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://caio.dev', // replace with real domain
  output: 'static',
  integrations: [vue(), react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

## `tsconfig.json`

```json
{
  "extends": "astro/tsconfigs/strictest",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

## Directory structure to create

```bash
mkdir -p src/{components,layouts,pages,features/{blog,work,playground},styles,lib,content}
mkdir -p src/features/playground/{token-studio,color-contrast,command-palette,states-quartet}
mkdir -p studio/schemas
mkdir -p public/fonts
```

## `package.json` scripts

```json
{
  "scripts": {
    "dev":      "astro dev",
    "build":    "astro build",
    "preview":  "astro preview",
    "check":    "astro check",
    "lint":     "biome check .",
    "test":     "vitest run",
    "test:e2e": "playwright test"
  }
}
```

## Tailwind v4 integration

In `src/styles/global.css` (first line only — see `design-system` spec for full content):

```css
@import "tailwindcss";
```

Import in `src/layouts/BaseLayout.astro`:
```astro
---
import '../styles/global.css';
---
```

## Environment variables

`.env` (git-ignored):
```
SANITY_PROJECT_ID=
SANITY_DATASET=production
SANITY_API_VERSION=2024-01-01
SANITY_READ_TOKEN=
```

Same vars in Cloudflare Pages → Settings → Environment variables (build context).

## CI — `.github/workflows/ci.yml`

```yaml
name: CI
on: [push, pull_request]
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run check
      - run: npm run lint
      - run: npm run build
        env:
          SANITY_PROJECT_ID: ${{ secrets.SANITY_PROJECT_ID }}
          SANITY_DATASET: ${{ secrets.SANITY_DATASET }}
          SANITY_API_VERSION: ${{ secrets.SANITY_API_VERSION }}
          SANITY_READ_TOKEN: ${{ secrets.SANITY_READ_TOKEN }}
      - run: npm run test:e2e
```

## Cloudflare Pages

- Connect GitHub repo in Cloudflare dashboard.
- Build command: `npm run build`
- Build output: `dist/`
- PR previews: automatic.
- Sanity webhook → Cloudflare Deploy Hook URL (set in Sanity Studio → API → Webhooks, trigger on `publish`).

## Definition of done

- `npm run dev` serves at localhost.
- `npm run check` exits 0.
- `npm run build` produces `dist/` with an `index.html`.
- Cloudflare preview URL live on first push.
