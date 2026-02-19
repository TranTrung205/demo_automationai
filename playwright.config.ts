import { defineConfig, devices } from '@playwright/test';

/**
 * ==================================
 * Playwright Configuration
 * ==================================
 * Includes:
 * - Multi browser
 * - AI JSON Reporter
 * - HTML Reporter
 * - Base URL
 */

export default defineConfig({

  testDir: './e2e',

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
    ['html'],
    ['./reporters/ai-json-reporter.ts']
  ],

  /**
   * ==================================
   * SHARED SETTINGS
   * ==================================
   */
  use: {

    baseURL: 'https://www.saucedemo.com',

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

    // {
    //   name: 'chromium-headless',
    //   use: { ...devices['Desktop Chrome Headless'] },
    // },
  ],
});   