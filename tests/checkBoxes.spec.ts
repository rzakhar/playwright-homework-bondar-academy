import { test, expect, Page, Locator } from '@playwright/test';

test.describe('Checkboxes Tests', () => {
    test.beforeEach(async ({ page }) => {
        await test.step('Open the home page', async () => {
            await page.goto('/')
            await expect(page.locator('.title')).toHaveText('Welcome to Petclinic')
        });
        await test.step('Navigate to Veterinarians page', async () => {
            await page.getByRole('button', { name: 'Veterinarians' }).click();
            await page.getByRole('link', { name: 'All' }).click();
            await expect(page.getByRole('heading', { name: 'Veterinarians' })).toBeVisible();
        });
    })

    test('Validate selected specialties', async ({ page }) => {
        const name = "Helen Leary";

        await test.step(`Verify specialties for vet ${name}`, async () => {
            await page.getByRole('row').filter({ hasText: name }).getByRole('button', { name: 'Edit Vet' }).click();
            await expect(page.locator('span.selected-specialties')).toHaveText("radiology");
            page.getByRole('list', { name: 'Specialties' });
            await page.locator('span.selected-specialties').click();

            await expect(page.getByRole('checkbox', { name: 'radiology' })).toBeChecked();
            await expect(page.getByRole('checkbox', { name: 'surgery' })).not.toBeChecked();
            await expect(page.getByRole('checkbox', { name: 'dentistry' })).not.toBeChecked();
        });

        await test.step('Modify specialties selection', async () => {
            await page.getByRole('checkbox', { name: 'surgery' }).check();
            await page.getByRole('checkbox', { name: 'radiology' }).uncheck();
            await expect(page.locator('span.selected-specialties')).toHaveText("surgery");
            await page.getByRole('checkbox', { name: 'dentistry' }).check();
            await expect(page.locator('span.selected-specialties')).toHaveText("surgery, dentistry");
        });
    });

    test('Select all specialties', async ({ page }) => {
        const name = "Rafael Ortega";

        await test.step(`Verify specialties for vet ${name}`, async () => {
            await page.getByRole('row').filter({ hasText: name }).getByRole('button', { name: 'Edit Vet' }).click();
            await expect(page.locator('span.selected-specialties')).toHaveText("surgery");
        });

        await test.step('Select all specialties', async () => {
            await page.locator('span.selected-specialties').click();
            await page.getByRole('checkbox', { name: 'dentistry' }).check();
            await page.getByRole('checkbox', { name: 'radiology' }).check();

            await expect(page.getByRole('checkbox', { name: 'radiology' })).toBeChecked();
            await expect(page.getByRole('checkbox', { name: 'surgery' })).toBeChecked();
            await expect(page.getByRole('checkbox', { name: 'dentistry' })).toBeChecked();
        });
    });

    test('Unselect all specialties', async ({ page }) => {
        const name = "Linda Douglas";

        await test.step(`Verify specialties for vet ${name}`, async () => {
            await page.getByRole('row').filter({ hasText: name }).getByRole('button', { name: 'Edit Vet' }).click();
            await expect(page.getByRole('heading', { name: 'Edit Veterinarian' })).toBeVisible(); 
            await expect(page.locator('span.selected-specialties')).toHaveText("dentistry, surgery");
        });

        await test.step('Unselect all specialties', async () => {
            await page.locator('span.selected-specialties').click();
            await page.getByRole('checkbox', { name: 'surgery' }).uncheck();
            await page.getByRole('checkbox', { name: 'dentistry' }).uncheck();

            await expect(page.getByRole('checkbox', { name: 'radiology' })).not.toBeChecked();
            await expect(page.getByRole('checkbox', { name: 'surgery' })).not.toBeChecked();
            await expect(page.getByRole('checkbox', { name: 'dentistry' })).not.toBeChecked();
            await expect(page.locator('span.selected-specialties')).toBeEmpty();
        });
    });
});
