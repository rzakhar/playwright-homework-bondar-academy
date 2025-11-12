import { test, expect, Page, Locator } from '@playwright/test';

test.describe('Input Fields Tests', () => {
    test.beforeEach(async ({ page }) => {
        await test.step('Open the home page', async () => {
            await page.goto('/')
            await expect(page.locator('.title')).toHaveText('Welcome to Petclinic')
        });
        await test.step('Navigate to Pet types page', async () => {
            await page.getByRole('navigation').getByRole('link', { name: 'Pet types' }).click();
            await expect(page.getByRole('heading', { name: 'Pet Types' })).toBeVisible();
        });
    })

    test('Update pet type', async ({ page }) => {
        const initialName = "cat";
        const newName = "rabbit";
        const firstCell = page.getByRole('cell').filter({ has: page.locator('input') }).first();

        await test.step(`Edit pet type from "${initialName}" to "${newName}"`, async () => {
            await page.getByRole('row', { name: initialName }).getByRole('button', { name: 'Edit' }).click();
            await expect(page.getByRole('heading', { name: 'Edit Pet Type' })).toBeVisible();
            await page.locator('.overlay').waitFor({ state: 'hidden', timeout: 5000 });
            await page.locator('#name').fill(newName);
            await page.getByRole('button', { name: 'Update' }).click();
            await expect(firstCell.locator('input')).toHaveValue(newName);
        });
        await test.step(`Revert pet type from "${newName}" back to "${initialName}"`, async () => {
            await page.getByRole('row', { name: newName }).getByRole('button', { name: 'Edit' }).click();
            await page.locator('.overlay').waitFor({ state: 'hidden', timeout: 5000 });
            await page.locator('#name').fill(initialName);
            await page.getByRole('button', { name: 'Update' }).click();
            await expect(firstCell.locator('input')).toHaveValue(initialName);
        });
    });

    test('Cancel pet type update', async ({ page }) => {
        const initialName = "dog";
        const newName = "moose";

        await test.step(`Start editing pet type from "${initialName}" to "${newName} and cancel"`, async () => {
            await page.getByRole('row', { name: initialName }).getByRole('button', { name: 'Edit' }).click();
            await expect(page.getByRole('heading', { name: 'Edit Pet Type' })).toBeVisible();
            const inputField = page.locator('#name');
            await inputField.fill(newName);
            await expect(inputField).toHaveValue(newName);
            await page.getByRole('button', { name: 'Cancel' }).click();
            await expect(page.getByRole('cell', { name: initialName }).locator('input')).toHaveValue(initialName);
        });
    });

    test('Pet type name is required validation', async ({ page }) => {
        const initialName = "lizard";

        await test.step(`Start editing pet type "${initialName}" and validate the form"`, async () => {
            await page.getByRole('row', { name: initialName }).getByRole('button', { name: 'Edit' }).click();
            await page.locator('.overlay').waitFor({ state: 'hidden', timeout: 5000 });
            await page.locator('#name').clear();
            const helpBlock = page.locator('span.help-block');
            await expect(helpBlock).toBeVisible();
            await expect(helpBlock).toHaveText('Name is required');
            await page.getByRole('button', { name: 'Update' }).click();
            await expect(page.getByRole('heading', { name: 'Edit Pet Type' })).toBeVisible();
            await page.getByRole('button', { name: 'Cancel' }).click();
            await expect(page.getByRole('heading', { name: 'Pet Types' })).toBeVisible();
        });
    });
});
