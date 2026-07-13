import { createClient, type SanityClient } from '@sanity/client';

/**
 * True when real Sanity credentials are present. Without them the site
 * builds from local fixtures (src/content/fixtures.ts) so dev and CI work
 * offline — see queries.ts.
 */
export const sanityConfigured = Boolean(import.meta.env.SANITY_PROJECT_ID);

export const sanity: SanityClient | null = sanityConfigured
  ? createClient({
      projectId: import.meta.env.SANITY_PROJECT_ID,
      dataset: import.meta.env.SANITY_DATASET ?? 'production',
      apiVersion: import.meta.env.SANITY_API_VERSION ?? '2024-01-01',
      token: import.meta.env.SANITY_READ_TOKEN,
      useCdn: false, // always build-time; CDN not needed
    })
  : null;
