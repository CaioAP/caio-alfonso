import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const KEY_ROUTES = ['/', '/blog', '/work', '/about', '/colophon', '/playground'];

for (const route of KEY_ROUTES) {
  test(`${route} renders and passes axe`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator('main')).toBeVisible();

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
  await expect(page.locator('article h1')).toBeVisible();
});

test('command palette opens with Ctrl+K and traps focus', async ({ page }) => {
  await page.goto('/playground/command-palette');
  await page.keyboard.press('Control+k');
  const dialog = page.locator('[role="dialog"]');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('input')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
});
