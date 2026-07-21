import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const KEY_ROUTES = ['/', '/blog', '/work', '/about', '/colophon', '/playground'];

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
