import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const KEY_ROUTES = [
  '/',
  '/blog',
  '/work',
  '/about',
  '/colophon',
  '/playground',
  // The demo pages carry the interactive UI, and /playground itself is only a
  // list of links to them — scanning the index alone scans none of it. This one
  // adds a radio group and an iframe, and axe cannot see across the frame
  // boundary, so what is asserted here is the host page's own chrome.
  '/playground/kanso-ui',
];

/**
 * Entry animations start at opacity 0, so scanning mid-flight makes axe measure
 * blended colours and report contrast failures that do not exist in the settled
 * page. Waiting for animations to finish is what makes the result meaningful.
 */
async function settled(page: import('@playwright/test').Page) {
  await page.waitForFunction(() =>
    document.getAnimations().every((a) => {
      // Looping animations (e.g. the availability pulse on /about) never reach
      // "finished", so waiting on them would hang rather than settle.
      if (a.effect?.getTiming().iterations === Number.POSITIVE_INFINITY) return true;
      return a.playState === 'finished';
    }),
  );
}

for (const route of KEY_ROUTES) {
  test(`${route} renders and passes axe`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator('main')).toBeVisible();
    await settled(page);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}

test('skip link is first focusable element', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
});

test('theme toggle switches data-theme and persists', async ({ page }) => {
  await page.goto('/');
  const initial = await page.locator('html').getAttribute('data-theme');
  await page.locator('#theme-toggle').click();
  const flipped = await page.locator('html').getAttribute('data-theme');
  expect(flipped).not.toBe(initial);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', flipped ?? '');
});

test('blog post page renders article content', async ({ page }) => {
  await page.goto('/blog');
  const first = page.locator('.post-row').first();
  await first.click();
  // Scoped to the header: post bodies may contain their own headings.
  await expect(page.locator('article header h1')).toBeVisible();
});

/**
 * Code blocks, on every post that has any.
 *
 * The key routes above never reach these. `/blog` is a list of links, and the
 * one post route they do cover is whichever happens to be first — so the code
 * path went unscanned until the first post with a code sample, and then failed
 * immediately: Shiki's `github-light` is tuned against #ffffff, and this site
 * repaints the background with --surface-sunk. Ten serious contrast violations,
 * none of which any existing test could see.
 *
 * Deliberately not pinned to a slug. Content moves; the assertion should hold
 * for whatever is published rather than for one post someone can rename.
 */
test('code blocks on every post pass axe in both themes', async ({ page }) => {
  await page.goto('/blog');
  const hrefs = await page
    .locator('.post-row')
    .evaluateAll((rows) =>
      rows.map((r) => (r as HTMLAnchorElement).href ?? r.querySelector('a')?.href).filter(Boolean),
    );
  expect(hrefs.length, 'no posts found to scan').toBeGreaterThan(0);

  let codeBlocksSeen = 0;

  for (const href of hrefs) {
    // Narrow, because that is where a code block starts overflowing and where
    // scrollable-region-focusable has anything to report at all.
    await page.setViewportSize({ width: 360, height: 900 });
    await page.goto(href);
    await settled(page);

    const blocks = await page.locator('.prose pre').count();
    if (blocks === 0) continue;
    codeBlocksSeen += blocks;

    // A scrollable region with no way to focus it is unreachable by keyboard.
    const unreachable = await page.evaluate(() =>
      [...document.querySelectorAll('.prose pre')]
        .filter((pre) => pre.scrollWidth > pre.clientWidth)
        .filter((pre) => pre.getAttribute('tabindex') === null)
        .map((pre) => (pre.textContent ?? '').slice(0, 60)),
    );
    expect(unreachable, `unfocusable scrollable code blocks on ${href}`).toEqual([]);

    // Contrast is computed from painted pixels, so one theme is half a test.
    for (const theme of ['light', 'dark'] as const) {
      await page.evaluate((t) => {
        document.documentElement.dataset.theme = t;
      }, theme);

      const results = await new AxeBuilder({ page })
        .include('.prose')
        .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
        .analyze();
      expect(results.violations, `axe on ${href} in ${theme}`).toEqual([]);
    }
  }

  // Skipped rather than passed when there is nothing to look at. A silent pass
  // asserting nothing is the exact failure mode that let the contrast bug ship;
  // a skip shows up in the report and says why. Goes green on its own as soon
  // as any post with a code sample is published.
  test.skip(codeBlocksSeen === 0, 'no published post contains a code block yet');
});

test('command palette opens with Ctrl+K and traps focus', async ({ page }) => {
  await page.goto('/playground/command-palette');
  // The Ctrl+K listener is bound in onMounted, so pressing before the island
  // hydrates silently does nothing. Astro drops the `ssr` attribute once done.
  await page.waitForFunction(() => !document.querySelector('astro-island[ssr]'));
  await page.keyboard.press('Control+k');
  const dialog = page.locator('[role="dialog"]');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('input')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
});
