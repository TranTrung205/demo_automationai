import { defineConfig, devices } from '@playwright/test';

export default defineConfig({

  testDir: './tests',

  // ⭐ IMPORTANT — use glob instead of regex
  testMatch: '**/*.spec.ts',

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  timeout: 60 * 1000,

  expect: {
    timeout: 10 * 1000,
  },

  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ],

  outputDir: 'test-results',

  use: {

    baseURL: 'https://www.saucedemo.com',

    headless: true,

    actionTimeout: 15 * 1000,

    navigationTimeout: 30 * 1000,

    trace: 'on-first-retry',

    screenshot: 'only-on-failure',

    video: 'retain-on-failure',

  },

  projects: [

    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },

  ],

});