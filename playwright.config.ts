import { defineConfig, devices } from '@playwright/test';

/**
 * ==================================
 * Playwright Configuration (FINAL)
 * ==================================
 * Optimized for AI Test Agent
 */

export default defineConfig({

  /**
   * Test directory
   */
  testDir: './tests',

  /**
   * Important for AI generated tests
   */
  testMatch: /.*\.spec\.ts/,

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  /**
   * Timeout (safe for AI runs)
   */
  timeout: 60 * 1000,

  expect: {
    timeout: 10 * 1000,
  },

  /**
   * ==================================
   * REPORTERS
   * ==================================
   */
  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ],

  /**
   * ==================================
   * SHARED SETTINGS
   * ==================================
   */
  use: {

    baseURL: 'https://www.saucedemo.com',

    headless: false,

    actionTimeout: 15 * 1000,

    navigationTimeout: 30 * 1000,

    trace: 'on-first-retry',

    screenshot: 'only-on-failure',

    video: 'retain-on-failure',
  },

  /**
   * ==================================
   * BROWSERS
   * ==================================
   */
  projects: [

    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },

    // Enable later if needed
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

  ],

});