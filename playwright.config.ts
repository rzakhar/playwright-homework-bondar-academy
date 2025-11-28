import { defineConfig, devices } from '@playwright/test';

require('dotenv').config();

export default defineConfig({
    fullyParallel: false,
    retries: process.env.CI ? 2 : 0,
    reporter: [
        ["list"],
        // Add Argos reporter.
        [
            "@argos-ci/playwright/reporter",
            {
                // Upload to Argos on CI only.
                uploadToArgos: !!process.env.CI,
            },
        ],
    ],
    workers: 1,
    globalSetup: '.auth/auth-setup.ts',
    timeout: 50000,
    use: {
        baseURL: 'https://petclinic.bondaracademy.com',
        trace: 'on-first-retry',
        screenshot: "only-on-failure",
        storageState: '.auth/user.json',
        extraHTTPHeaders: {
            'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`
        },
        actionTimeout: 40000,
        viewport: { height: 1080, width: 1920 }
    },

    projects: [
        {
            name: 'chromium',
            use: {
                browserName: 'chromium'
            },
        },
        {
            name: 'firefox',
            use: {
                browserName: 'firefox'
            },
        },
    ],
});
