import { defineConfig, devices } from "@playwright/test";

export default defineConfig({

  testMatch: "**/*.spec.ts",

  fullyParallel: true,

  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  timeout: 90 * 1000,

  expect: {
    timeout: 15 * 1000,
  },

  reporter: [
    ["list"],
    ["html", { open: "never" }],
    // ["./ai/reporters/ai-json-reporter.ts"]
  ],

  outputDir: "test-results",

  use: {
    baseURL: "https://www.saucedemo.com",
    headless: true,
    actionTimeout: 20 * 1000,
    navigationTimeout: 45 * 1000,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [

    // 🔵 Manual UI
    {
      name: "manual-ui",
      testDir: "./tests/manual/ui",
      use: { ...devices["Desktop Chrome"] },
    },

    // 🔵 Manual API
    {
      name: "manual-api",
      testDir: "./tests/manual/api",
    },

    // 🔴 AI UI
    {
      name: "ai-ui",
      testDir: "./tests/ai_generated/ui",
      use: { ...devices["Desktop Chrome"] },
    },

    // 🔴 AI API
    {
      name: "ai-api",
      testDir: "./tests/ai_generated/api",
    },

  ],
});