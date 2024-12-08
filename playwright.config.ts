import {defineConfig, devices} from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({path: './.env.test'})

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : 1,
    reporter: 'html',
    use: {
        baseURL: 'http://localhost:3000',
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'chromium',
            use: {...devices['Desktop Chrome']},
        },
        {
            name: 'firefox',
            use: {...devices['Desktop Firefox']},
        },
    ],
    webServer: {
        command: 'yarn build && yarn start',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
    },
});
