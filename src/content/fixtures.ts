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
  name: 'Caio Alfonso',
  headline: 'Interfaces that work for people!',
  bioShort:
    "A frontend bug where I work isn't just annoying. It's money moving wrong. That's put me in the seat of setting architecture, defining standards, and owning the design system other engineers build on top of. Vue and Nuxt are home turf; React and Next are what I'm building into next.",
  bio: [
    block('bio-h1', 'Career', 'h3'),
    block(
      'bio1',
      "I started as an intern at an accounting firm, writing jQuery against a Python backend, and talked my way into introducing Vue to the team because it was obviously better than what we had. That's stayed the pattern since: notice what's broken, fix it, own the fix.",
    ),
    block(
      'bio2',
      "From there I refactored a 10 year old PHP legacy system while shipping a new product alongside it, then rebuilt an internal tool into a SaaS product solo, backend included, built in NestJS. For the past couple years I've led frontend architecture on a fintech platform moving millions in monthly transactions, where design system consistency, accessibility and LGPD compliant data handling are simply part of the job. I also run a side initiative there: an internal automation tool wired into WhatsApp and generative AI, where I own the stack decisions and the contracts with backend and infra.",
    ),
    block('bio-h2', 'How I work', 'h3'),
    block(
      'bio3',
      "The parts of an interface most engineers gloss over are where seniority actually shows: keeping optimistic UI in sync with what the server eventually confirms, catching a hydration mismatch before it causes a layout jump, invalidating cached state everywhere it's read after a mutation. That's where trust in an interface gets won or lost.",
    ),
    block(
      'bio4',
      "I'd rather set a standard once than fix the same bug five times across a codebase. Vue and Nuxt are where most of these eight years went. React and Next are next, and this site runs both side by side, on purpose.",
    ),
    block('bio-h3', 'Off the clock', 'h3'),
    block(
      'bio5',
      "Most of my free time goes to my wife and friends, just hanging out and talking, no real agenda beyond that. I grew up on FPS games, Counter-Strike mainly, and still boot it up when friends are around, even though I've long stopped taking it seriously. Music is rock, grunge and nu metal specifically, though I'll listen to most of the genre. Lately I've been teaching myself Japanese on my own, with manga as the excuse to keep showing up to it.",
    ),
    block('bio6', 'Based in Goiânia, Brazil. Open to new opportunities.'),
  ],
  location: 'Goiânia, Brazil',
  email: 'caioap25@gmail.com',
  socials: [
    { label: 'GitHub', url: 'https://github.com/CaioAP' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/caio-alfonso-597b8196/' },
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
    company: 'Cilia',
    role: 'Senior Frontend Developer',
    start: '2023-11-01',
    location: 'Goiânia, Brazil',
    highlights: [
      'Own frontend architecture for a highly critical financial application: component structure, security standards, and auth/access-control flows for a platform moving millions of reais in monthly transactions.',
      'Built product components against a new design system, keeping visual consistency, accessibility, and reusability across the platform.',
      'Implemented data-protection practices aligned with LGPD and drove automated test coverage for sensitive financial data flows.',
      'Led an internal workflow-automation product integrated with WhatsApp and generative AI, as technical lead on architecture, stack choices, and API contract negotiation with backend and infra.',
      'Defined integration contracts with backend for scalability, so product needs were met with resilience baked in from the start.',
    ],
    stack: ['Vue 3', 'TypeScript', 'Design Systems', 'LGPD/Security', 'REST APIs', 'Generative AI'],
    order: 1,
  },
  {
    _id: 'exp-2',
    company: 'Ação Tecnologia',
    role: 'Senior Fullstack Developer',
    start: '2022-05-01',
    end: '2023-10-31',
    location: 'Goiânia, Brazil',
    highlights: [
      'Sole developer remodeling an internal product into a SaaS architecture, structuring both frontend and backend from scratch, including data modeling.',
      'Built the backend in NestJS with dependency injection and clean-code practices, including monetary-value logic for payments and external transactions.',
      'Used Nuxt with SSR for load performance and technical SEO from day one, prioritizing stability for a product moving to market.',
    ],
    stack: ['Nuxt', 'Vue 3', 'NestJS', 'Node.js', 'TypeScript'],
    order: 2,
  },
  {
    _id: 'exp-3',
    company: 'Oni Tecnologia',
    role: 'Mid-Level Fullstack Developer',
    start: '2021-01-01',
    end: '2022-04-30',
    location: 'Goiânia, Brazil',
    highlights: [
      'Refactored a legacy application (10+ years in production, PHP/Zend Framework), rewriting high-complexity, low-performance modules to cut technical debt.',
      'Built a new online medical-scheduling product from scratch to launch with Vue.js and Nuxt, focused on responsive and accessible UX.',
      'Worked directly with product on technical decisions, keeping architecture and experience choices grounded in real user needs from the start.',
    ],
    stack: ['Vue.js', 'Nuxt', 'PHP', 'Zend Framework'],
    order: 3,
  },
  {
    _id: 'exp-4',
    company: 'Soma Contabilidade',
    role: 'Intern → Junior Developer',
    start: '2018-05-01',
    end: '2020-12-31',
    location: 'Goiânia, Brazil',
    highlights: [
      'Built internal process-management interfaces with HTML, CSS, JavaScript and jQuery against a Python server, evolving toward Vanilla JS components.',
      "Proposed and led the team's adoption of Vue.js after seeing the productivity gains, becoming the one who introduced the framework into the company.",
    ],
    stack: ['HTML', 'CSS', 'JavaScript', 'jQuery', 'Python', 'Vue.js'],
    order: 4,
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
      // Exercises the CodeBlock renderer. Real Sanity has no posts yet, so
      // fixture builds are the only thing that runs this path — keep it.
      {
        _type: 'code',
        _key: 'po1code',
        language: 'ts',
        filename: 'async-state.ts',
        code: [
          'type AsyncState<T> =',
          "  | { status: 'loading' }",
          "  | { status: 'empty' }",
          "  | { status: 'error'; error: Error }",
          "  | { status: 'success'; data: T };",
        ].join('\n'),
      },
      block('po1b4', 'Render each arm explicitly and the compiler refuses to let you forget one.'),
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
      // Exercises the ImageBlock renderer, including intrinsic-size parsing
      // from the asset ref. Same reasoning as the code node above.
      {
        _type: 'image',
        _key: 'po2img',
        asset: { _ref: 'image-fixturefocusring0000000000000000000-1600x900-png' },
        alt: 'A focus ring resting on the button that opened a dialog.',
        caption: 'Focus returning to its trigger after the dialog closes.',
      },
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
