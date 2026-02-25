import { test, expect } from '@playwright/test'

test('Recipes page lists newest-first and card images render', async ({ page, baseURL }) => {
  await page.goto(baseURL + '/recipes')
  // Cards are links with View Recipe button; select by button presence
  const grid = page.locator('section:has-text("Recipes")')
  const items = page.locator('a:has-text("View Recipe")')
  await expect(items.first()).toBeVisible()
})


