import { defineConfig, devices } from "@playwright/test"
import { isEmpty } from "lodash"

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./e2e",
  outputDir: "./e2e-results",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  // workers: process.env.CI ? 1 : undefined,
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [["html", { outputFolder: "e2e-report" }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://localhost:4445",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry"
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    },

    process.env.FIREFOX
      ? {
          name: "firefox",
          use: { ...devices["Desktop Firefox"] }
        }
      : {},

    process.env.SAFARI
      ? {
          name: "webkit",
          use: { ...devices["Desktop Safari"] }
        }
      : {}

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ..devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ].filter((browser) => !isEmpty(browser)),

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "bun dev:test",
    url: "http://localhost:4445",
    stdout: process.env.SERVER_OUTPUT ? "pipe" : "ignore",
    reuseExistingServer: !process.env.CI,
    timeout: 10000,
    env: {
      USER_EMAILS: "test+0@example.com"
    }
  }
})
