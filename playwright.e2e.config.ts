import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: 'tests/e2e',
  testMatch: /.*\.e2e\.spec\.(ts|js)/,
  timeout: 60_000,
  retries: 0,
  use: {
    baseURL: process.env.BASE_URL || 'https://jvs-vercel.vercel.app',
    headless: true,
  },
})























