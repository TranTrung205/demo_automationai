import { defineConfig, devices } from "@playwright/test";

export default defineConfig({

  /**
   * AI generated tests location
   */
  testDir: "./tests/ui",

  /**
   * Match spec files
   */
  testMatch: "**/*.spec.ts",

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  /**
   * Global timeout
   */
  timeout: 90 * 1000,

  expect: {
    timeout: 15 * 1000,
  },

  /**
   * Reporters
   */
  reporter: [

    ["list"],

    ["html", {
      open: "never"
    }],

    /**
     * Optional AI reporter
     * Uncomment if using ai-json-reporter
     */
    // ["./ai/reporters/ai-json-reporter.ts"]

  ],

  outputDir: "test-results",

  use: {

    /**
     * Default base URL
     */
    baseURL: "https://www.saucedemo.com",

    headless: true,

    actionTimeout: 20 * 1000,

    navigationTimeout: 45 * 1000,

    trace: "on-first-retry",

    screenshot: "only-on-failure",

    video: "retain-on-failure",
  },

  projects: [

    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },

  ],

});