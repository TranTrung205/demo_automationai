import { defineConfig, devices } from '@playwright/test';

/**
 * ==================================
 * Playwright Configuration
 * ==================================
 * - Multi browser
 * - HTML Reporter
 * - Base URL
 * - AI Agent compatible
 */

export default defineConfig({

  /**
   * Test folder
   */
  testDir: './tests',

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  /**
   * ==================================
   * REPORTERS
   * ==================================
   */
  reporter: [
    ['list'],
    ['html']
  ],

  /**
   * ==================================
   * SHARED SETTINGS
   * ==================================
   */
  use: {

    baseURL: 'https://www.saucedemo.com',

    headless: false,

    trace: 'on-first-retry',

    screenshot: 'only-on-failure',

    video: 'retain-on-failure'
  },

  /**
   * ==================================
   * BROWSERS
   * ==================================
   */
  projects: [

    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

  ],

});
