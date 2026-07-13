export interface Demo {
  id: string; // matches folder name and URL slug
  title: string;
  description: string;
  framework: 'Vue' | 'React' | 'Vue ↔ React';
  /** Short architecture note rendered under the demo. */
  howBuilt: string;
  // dynamic import — Astro/Vite resolves at build time
  load: () => Promise<{ default: unknown }>;
}

export const registry: Demo[] = [
  {
    id: 'token-studio',
    title: 'Design Token Studio',
    description: "Edit this site's tokens live; export the CSS.",
    framework: 'React',
    howBuilt:
      'The site theme is CSS custom properties in OKLCH — so "theming" is just setProperty on the root element. React state holds the parsed L/C/H channels; every slider drag re-formats the token and writes it back, and the whole page re-themes because everything reads the same variables. The contrast badges reuse the same color math as the Contrast Checker (src/lib/color.ts) — one framework-agnostic module, two islands in two frameworks.',
    load: () => import('./token-studio/TokenStudio'),
  },
  {
    id: 'color-contrast',
    title: 'Contrast & A11y Checker',
    description: 'Two colors → the WCAG verdict and a fix.',
    framework: 'Vue',
    howBuilt:
      'All the color math is pure TypeScript in src/lib/color.ts: sRGB → relative luminance → contrast ratio, straight from the WCAG definition. The Vue layer is thin — two refs and computed values. The "suggest a fix" walks the text color\'s lightness away from the background until the ratio clears 4.5:1: simple, predictable, and it always terminates.',
    load: () => import('./color-contrast/ContrastChecker.vue'),
  },
  {
    id: 'command-palette',
    title: 'Command Palette ⌘K',
    description: 'Keyboard-first, fuzzy navigation.',
    framework: 'Vue',
    howBuilt:
      'Fuse.js does the fuzzy matching; the interesting work is the accessibility contract: role="dialog" + aria-modal, a combobox input with aria-activedescendant tracking the highlighted option, focus moved in on open and restored to the trigger on close, and a focus trap while open. The gotcha: arrow-key selection must not move DOM focus — the input keeps it, aria-activedescendant does the announcing.',
    load: () => import('./command-palette/CommandPalette.vue'),
  },
  {
    id: 'states-quartet',
    title: 'The States Quartet',
    description: 'Loading · empty · error · success, done right.',
    framework: 'Vue',
    howBuilt:
      'The state is a discriminated union — { kind: "error", message } can exist, { kind: "success" } without items cannot. That is the architecture point: impossible states don\'t compile. The UX points: loading is a skeleton that preserves layout (no spinner-and-jump), empty is an invitation with an action, error is a human sentence plus retry. The skeleton pulse sits inside prefers-reduced-motion.',
    load: () => import('./states-quartet/StatesQuartet.vue'),
  },
];

export function getDemo(id: string): Demo | undefined {
  return registry.find((d) => d.id === id);
}
