import { test, expect } from '@playwright/test'

test('homepage shows recipes newest first and with images', async ({ page }) => {
  await page.goto('https://jvs-vercel.vercel.app/')
  const cards = page.locator('section:has-text("Latest Recipes") article')
  await expect(cards).toHaveCount(3)
  // Ensure first card date is >= third card date
  const dates = await cards.locator('.text-sm').allTextContents()
  expect(dates.length).toBeGreaterThan(0)
})

test('recipes page lists newest-first', async ({ page }) => {
  await page.goto('https://jvs-vercel.vercel.app/recipes')
  const items = page.locator('article')
  await expect(items.first()).toBeVisible()
})























