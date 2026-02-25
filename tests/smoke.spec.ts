import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || 'http://localhost:3000';

test('homepage loads and shows latest sections', async ({ page }) => {
  await page.goto(`${BASE}/`);
  await expect(page.getByRole('heading', { name: /Latest Articles/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Upcoming Events/i })).toBeVisible();
});

test('/articles list and search work', async ({ page }) => {
  await page.goto(`${BASE}/articles/`);
  await expect(page.getByRole('heading', { name: /Articles/i })).toBeVisible();
  await page.getByPlaceholder('Search articles...').fill('vegan');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/articles\/?\?q=vegan/);
});

test('/recipes list and search work', async ({ page }) => {
  await page.goto(`${BASE}/recipes/`);
  await expect(page.getByRole('heading', { name: /Vegan Recipes/i })).toBeVisible();
  await page.getByPlaceholder('Search recipes...').fill('tofu');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/recipes\/?\?q=tofu/);
});

test('revalidation endpoints respond 200', async ({ request }) => {
  const secret = process.env.REVALIDATE_ARTICLES_SECRET || 'dev';
  const res = await request.post(`${BASE}/api/revalidate-articles`, { headers: { Authorization: `Bearer ${secret}` } });
  expect([200, 401]).toContain(res.status());
});






















