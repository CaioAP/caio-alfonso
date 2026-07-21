# Sanity Studio

Schemas for the portfolio content types: `profile` (singleton), `post`, `project`, `experience`, `series`.

Project ID `ftpb674o`, dataset `production` (private). Both are set in `sanity.config.ts` and
`sanity.cli.ts` — the projectId is public and ships in the Studio bundle, so it is not a secret and
needs no `.env` here. Auth is per-machine via `npx sanity login`.

Formatting and linting are owned by the repo-root Biome config, not a Studio-local ESLint/Prettier.

## Local development

```bash
cd studio
npm install
npm run dev      # sanity dev  → http://localhost:3333
```

## Deploy the hosted Studio

```bash
npm run deploy   # sanity deploy → <hostname>.sanity.studio
```

## Schemas

`schemas/` is the source of truth and is mirrored by Zod schemas in `src/content/schemas.ts` on the
app side — the Astro build fails on mismatch. Change a field here, change it there too.

## Webhook → Cloudflare Pages rebuild

1. Cloudflare Pages → Settings → Builds → Deploy Hooks → create hook URL.
2. Sanity Manage → API → Webhooks → add webhook:
   - URL: the Cloudflare hook URL
   - Trigger on: `publish`
   - Filter: `_type in ["post", "project", "experience", "profile"]`
