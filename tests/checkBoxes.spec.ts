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
        await test.step(`Verify specialties for vet Helen Leary`, async () => {
            await page.getByRole('row', { name: "Helen Leary" }).getByRole('button', { name: 'Edit Vet' }).click();
            await expect(page.locator('span.selected-specialties')).toHaveText("radiology");
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
        await test.step(`Verify specialties for vet Rafael Ortega`, async () => {
            await page.getByRole('row').filter({ hasText: "Rafael Ortega" }).getByRole('button', { name: 'Edit Vet' }).click();
            await expect(page.locator('span.selected-specialties')).toHaveText("surgery");
        });

        await test.step('Select all specialties', async () => {
            await page.locator('span.selected-specialties').click();
            const allSpecialtiesList = ['radiology', 'surgery', 'dentistry'];
            for (const specialty of allSpecialtiesList) {
                await page.getByRole('checkbox', { name: specialty }).check();
                await expect(page.getByRole('checkbox', { name: specialty })).toBeChecked();
            }
            await expect(page.locator('span.selected-specialties')).toHaveText("surgery, radiology, dentistry");
        });
    });

    test('Unselect all specialties', async ({ page }) => {
        await test.step(`Verify specialties for vet Linda Douglas`, async () => {
            await page.getByRole('row').filter({ hasText: "Linda Douglas" }).getByRole('button', { name: 'Edit Vet' }).click();
            await expect(page.getByRole('heading', { name: 'Edit Veterinarian' })).toBeVisible();
            await expect(page.locator('span.selected-specialties')).toHaveText("dentistry, surgery");
        });

        await test.step('Unselect all specialties', async () => {
            await page.locator('span.selected-specialties').click();
            const allSpecialtiesList = ['radiology', 'surgery', 'dentistry'];
            for (const specialty of allSpecialtiesList) {
                await page.getByRole('checkbox', { name: specialty }).uncheck();
                await expect(page.getByRole('checkbox', { name: specialty })).not.toBeChecked();
            }
            await expect(page.locator('span.selected-specialties')).toBeEmpty();
        });
    });
});
