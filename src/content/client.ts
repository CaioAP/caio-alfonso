import { createClient, type SanityClient } from '@sanity/client';

/**
 * True when real Sanity credentials are present. Without them the site
 * builds from local fixtures (src/content/fixtures.ts) so dev and CI work
 * offline; see queries.ts.
 */
export const sanityConfigured = Boolean(import.meta.env.SANITY_PROJECT_ID);

export const sanity: SanityClient | null = sanityConfigured
  ? createClient({
      projectId: import.meta.env.SANITY_PROJECT_ID,
      dataset: import.meta.env.SANITY_DATASET ?? 'production',
      apiVersion: import.meta.env.SANITY_API_VERSION ?? '2024-01-01',
      token: import.meta.env.SANITY_READ_TOKEN,
      useCdn: false, // always build-time; CDN not needed
      /**
       * Published documents only.
       *
       * Not a default worth relying on. With a token and no `perspective`, the
       * client answers from `raw`, which includes `drafts.*` — so an unfinished
       * draft in the Studio was rendered into the production build and shipped
       * on the next deploy. Verified by creating a draft and finding its body
       * text in `dist/work/<slug>/index.html`, with the entry also listed on
       * `/work`.
       *
       * There is no preview mode here to break: the site is SSG and the Studio
       * is where drafts are meant to be read.
       */
      perspective: 'published',
    })
  : null;
