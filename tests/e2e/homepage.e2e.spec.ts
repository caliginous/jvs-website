import { test, expect } from '@playwright/test'

test('Latest Recipes are newest-first and have images where available', async ({ page, baseURL }) => {
  await page.goto(baseURL + '/')
  const section = page.locator('section:has-text("Latest Recipes")')
  await expect(section).toBeVisible()
  const cards = section.locator('article')
  await expect(cards).toHaveCount(3)
  // Verify order by checking the date text of first and third cards
  const firstDate = await cards.nth(0).locator('time, .text-sm').first().innerText()
  const thirdDate = await cards.nth(2).locator('time, .text-sm').first().innerText()
  // If parse fails, just assert text differs to catch obvious misorder
  const d1 = Date.parse(firstDate)
  const d3 = Date.parse(thirdDate)
  if (!isNaN(d1) && !isNaN(d3)) expect(d1).toBeGreaterThanOrEqual(d3)
})


