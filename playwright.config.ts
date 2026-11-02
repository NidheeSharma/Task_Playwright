import { defineConfig, devices } from '@playwright/test';
import { env } from './config';

const isCI = !!process.env.CI;

if (process.env.WORKERS && Number.isNaN(Number(process.env.WORKERS))) {
  throw new Error(`WORKERS must be a number, received "${process.env.WORKERS}"`);
}

const workers: number | string = process.env.WORKERS
  ? Number(process.env.WORKERS)
  : isCI
    ? 2
    : '50%';

/**
 * Browser projects ignore API-only specs. The `api` project is request-only:
 * Playwright still requires a browserName internally, but those specs must
 * use `request` (never `page`) so no UI session is exercised.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers,
  timeout: env.timeout,
  expect: { timeout: 10_000 },
  reporter: isCI
    ? [
        ['list'],
        ['github'],
        ['html', { open: 'never', outputFolder: 'playwright-report' }],
        ['allure-playwright', { detail: true, suiteTitle: true, resultsDir: 'allure-results' }],
      ]
    : [
        ['list'],
        ['html', { open: 'never', outputFolder: 'playwright-report' }],
        ['allure-playwright', { detail: true, suiteTitle: true, resultsDir: 'allure-results' }],
      ],
  use: {
    baseURL: env.baseURL,
    extraHTTPHeaders: {
      Accept: 'application/json, text/html;q=0.9',
    },
    testIdAttribute: 'data-qa',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  metadata: {
    env: env.name,
    baseURL: env.baseURL,
    apiURL: env.apiURL,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: /[/\\]api[/\\]/,
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testIgnore: /[/\\]api[/\\]/,
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testIgnore: /[/\\]api[/\\]/,
    },
    {
      name: 'api',
      testMatch: /[/\\]api[/\\].*\.spec\.ts/,
      use: {
        browserName: 'chromium',
        screenshot: 'off',
        video: 'off',
        trace: 'on-first-retry',
      },
    },
  ],
});
