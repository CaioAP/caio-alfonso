# Sanity Studio

Schemas for the portfolio content types: `profile` (singleton), `post`, `project`, `experience`, `series`.

## Setup

```bash
cd studio
npm create sanity@latest -- --project <projectId> --dataset production
# or, if scaffolding manually:
npm i sanity @sanity/vision react react-dom styled-components
npx sanity dev
```

`sanity.config.ts` and `schemas/` in this directory are the source of truth — drop them into the scaffolded Studio.

## Webhook → Cloudflare Pages rebuild

1. Cloudflare Pages → Settings → Builds → Deploy Hooks → create hook URL.
2. Sanity Manage → API → Webhooks → add webhook:
   - URL: the Cloudflare hook URL
   - Trigger on: `publish`
   - Filter: `_type in ["post", "project", "experience", "profile"]`
