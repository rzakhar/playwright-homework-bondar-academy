import { defineConfig, devices } from '@playwright/test';

require('dotenv').config();

export default defineConfig({
    fullyParallel: false,
    workers: 1,
    retries: 0,
    reporter: 'html',
    globalSetup: '.auth/auth-setup.ts',
    timeout: 30000,
    use: {
        baseURL: 'https://petclinic.bondaracademy.com',
        trace: 'on-first-retry',
        storageState: '.auth/user.json',
        extraHTTPHeaders: {
            'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`
        },
        actionTimeout: 20000,
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
