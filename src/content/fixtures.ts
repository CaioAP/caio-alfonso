/**
 * Local sample content used when SANITY_PROJECT_ID is not set.
 * Lets dev and CI build offline. Shapes mirror the Sanity GROQ results
 * and are still validated through the Zod schemas in queries.ts.
 */

function block(key: string, text: string, style = 'normal') {
  return {
    _type: 'block',
    _key: key,
    style,
    markDefs: [],
    children: [{ _type: 'span', _key: `${key}-s`, text, marks: [] }],
  };
}

export const fixtureProfile = {
  name: 'Caio',
  headline: 'Interfaces that work for people, built from systems, not luck.',
  bio: [
    block(
      'bio1',
      'Frontend engineer focused on usability and architecture. Vue and Nuxt are home turf; React and Next are the learning arc, shown in public. I care about the invisible details (focus order, motion preferences, loading states) because that is where usability actually lives.',
    ),
    block(
      'bio2',
      'This site is the work sample: a design-token system you can edit live, content pages that ship zero JavaScript, and interactive demos built as isolated islands.',
    ),
  ],
  location: 'Goiânia, Brazil',
  email: 'caio@example.com',
  socials: [
    { label: 'GitHub', url: 'https://github.com/caio' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/caio' },
  ],
  availableForWork: true,
  photo: {
    asset: { _ref: 'image-fixture-640x640-jpg' },
    alt: 'Portrait of Caio',
  },
};

export const fixtureExperiences = [
  {
    _id: 'exp-1',
    company: 'Acme Fintech',
    role: 'Senior Frontend Engineer',
    start: '2023-03-01',
    location: 'Remote',
    highlights: [
      'Led the design-token migration across three product teams.',
      'Cut LCP from 4.1s to 1.8s on the customer dashboard.',
      'Introduced axe-based a11y gates to CI.',
    ],
    order: 1,
  },
  {
    _id: 'exp-2',
    company: 'Studio Norte',
    role: 'Frontend Engineer',
    start: '2020-06-01',
    end: '2023-02-28',
    location: 'Goiânia',
    highlights: [
      'Built and maintained a Vue 3 component library used by 12 client projects.',
      'Shipped a headless-CMS publishing pipeline for editorial teams.',
    ],
    order: 2,
  },
  {
    _id: 'exp-3',
    company: 'Freelance',
    role: 'Web Developer',
    start: '2018-01-01',
    end: '2020-05-31',
    highlights: ['Delivered marketing sites and small e-commerce builds for local businesses.'],
    order: 3,
  },
];

export const fixtureProjects = [
  {
    _id: 'proj-1',
    title: 'Token-driven Design System',
    slug: { current: 'token-driven-design-system' },
    role: 'Lead engineer',
    period: '2024–2025',
    stack: ['Vue', 'TypeScript', 'Tailwind', 'Figma Tokens'],
    summary:
      'A CSS-variable token system powering three products from one source of truth: themes, spacing, and type scale included.',
    body: [
      block(
        'p1b1',
        'The problem: three products, three diverging stylesheets, no shared language with design.',
      ),
      block(
        'p1b2',
        'The fix: a single token layer (CSS custom properties, OKLCH color) that Tailwind utilities and hand-written CSS both read from. Dark mode became a token swap, not a rewrite.',
      ),
    ],
    links: [{ label: 'Case notes', url: 'https://example.com/design-system' }],
    featured: true,
    order: 1,
  },
  {
    _id: 'proj-2',
    title: 'Editorial Publishing Pipeline',
    slug: { current: 'editorial-publishing-pipeline' },
    role: 'Frontend engineer',
    period: '2022–2023',
    stack: ['Nuxt', 'Sanity', 'Cloudflare'],
    summary:
      'Headless CMS to static edge deploy in under two minutes: writers publish without touching git.',
    body: [
      block('p2b1', 'Editors needed to publish daily without engineering in the loop.'),
      block(
        'p2b2',
        'Sanity Studio fires a webhook, the site rebuilds statically, and the edge cache does the rest. Zero servers to babysit.',
      ),
    ],
    links: [{ label: 'Write-up', url: 'https://example.com/publishing-pipeline' }],
    featured: true,
    order: 2,
  },
  {
    _id: 'proj-3',
    title: 'Accessible Component Library',
    slug: { current: 'accessible-component-library' },
    role: 'Author',
    period: '2021–2022',
    stack: ['Vue', 'TypeScript', 'Vitest'],
    summary:
      'Keyboard-first component library: focus management, ARIA patterns, and reduced-motion support baked in.',
    body: [
      block('p3b1', 'Every component keyboard-operable before it ships; axe checks run in CI.'),
    ],
    links: [{ label: 'Repository', url: 'https://example.com/component-library' }],
    featured: false,
    order: 3,
  },
];

export const fixtureSeries = [
  {
    _id: 'series-1',
    title: 'UX & Usability',
    slug: { current: 'ux-usability' },
    description: 'The details that make interfaces work for people.',
  },
  {
    _id: 'series-2',
    title: 'Frontend Architecture',
    slug: { current: 'frontend-architecture' },
    description: 'Structure, boundaries, and decisions that scale.',
  },
];

export const fixturePosts = [
  {
    _id: 'post-1',
    title: 'The four states every async UI owes its users',
    slug: { current: 'four-states-async-ui' },
    publishedAt: '2026-07-10T09:00:00Z',
    excerpt:
      'Loading, empty, error, success. Most interfaces ship one and a half of them. Here is the checklist that catches the rest.',
    tags: ['ux', 'architecture'],
    series: { title: 'UX & Usability', slug: { current: 'ux-usability' } },
    body: [
      block(
        'po1b1',
        'Every widget that fetches data has four possible states: loading, empty, error, and success. Most interfaces ship the success state, half of a loading state, and nothing else.',
      ),
      block(
        'po1b2',
        'Loading deserves a skeleton, not just a spinner: it preserves layout and sets expectations. Empty deserves an invitation: what can the user do to fill this space? Error deserves a human sentence and a retry action. Success is the easy one; you already built it.',
      ),
      block(
        'po1b3',
        'Model the quartet as a discriminated union and impossible states stop compiling. The States Quartet demo in the Playground shows the pattern live.',
      ),
    ],
    draft: false,
  },
  {
    _id: 'post-2',
    title: 'Put focus management on your component checklist',
    slug: { current: 'focus-management-checklist' },
    publishedAt: '2026-07-09T09:00:00Z',
    excerpt:
      'Keyboard users notice the feature you forgot. Where focus lands after an action is a design decision: make it on purpose.',
    tags: ['a11y', 'ux'],
    series: { title: 'UX & Usability', slug: { current: 'ux-usability' } },
    body: [
      block(
        'po2b1',
        'Open a modal: focus should move inside it. Close it: focus should return to the trigger. Delete a list item: focus should land on the next item, not evaporate to <body>.',
      ),
      block(
        'po2b2',
        'None of this happens by default. It is a design decision, and skipping it means keyboard and screen-reader users lose their place in your interface.',
      ),
    ],
    draft: false,
  },
  {
    _id: 'post-3',
    title: 'Feature folders beat layer folders (until they don’t)',
    slug: { current: 'feature-folders-vs-layer-folders' },
    publishedAt: '2026-07-08T09:00:00Z',
    excerpt:
      'Grouping by feature keeps change local: one folder per domain, everything a feature needs inside it. The exception is real primitives.',
    tags: ['architecture'],
    series: { title: 'Frontend Architecture', slug: { current: 'frontend-architecture' } },
    body: [
      block(
        'po3b1',
        'Layer folders (components/, utils/, types/) scatter every feature across the tree. A change to "blog" touches five directories.',
      ),
      block(
        'po3b2',
        'Feature folders keep change local: src/features/blog owns its components, utils, and types. The exception: genuine cross-feature primitives (Button, Prose) which earn a shared components/ home.',
      ),
    ],
    draft: false,
  },
  {
    _id: 'post-4',
    title: 'useEffect through Vue eyes',
    slug: { current: 'useeffect-through-vue-eyes' },
    publishedAt: '2026-07-07T09:00:00Z',
    excerpt:
      'A Vue dev expects watch. React hands you useEffect, and the dependency array is where the mental model breaks.',
    tags: ['react', 'vue'],
    body: [
      block(
        'po4b1',
        'In Vue, watch(source, callback) declares its trigger explicitly. In React, useEffect re-runs when anything in its dependency array changes, and the array is on you to get right.',
      ),
      block(
        'po4b2',
        'The trap: reaching for useEffect to "watch" derived state. Most of the time you want to compute it during render, or you want an event handler, not an effect.',
      ),
    ],
    draft: false,
  },
  {
    _id: 'post-5',
    title: 'TIL: color-mix() makes token washes free',
    slug: { current: 'til-color-mix-token-washes' },
    publishedAt: '2026-07-06T09:00:00Z',
    excerpt:
      'Need a 26% tint of your accent for a selection highlight? color-mix(in oklch, var(--shu) 26%, transparent). No extra token.',
    tags: ['css', 'til'],
    body: [
      block(
        'po5b1',
        'This site’s text selection color is color-mix(in oklch, var(--shu) 26%, transparent): a wash derived from the accent token at use-time. One less token to maintain, and it tracks theme changes automatically.',
      ),
    ],
    draft: false,
  },
];
