import { test, expect } from '@playwright/test';

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
        await test.step('Edit pet type from "cat" to "rabbit"', async () => {
            await page.getByRole('row', { name: "cat" }).getByRole('button', { name: 'Edit' }).click();
            await expect(page.getByRole('heading', { name: 'Edit Pet Type' })).toBeVisible();
            await expect(page.locator('#name')).toHaveValue("cat");
            await page.locator('#name').fill("rabbit");
            await page.getByRole('button', { name: 'Update' }).click();
            await expect(page.locator('[id="0"]')).toHaveValue("rabbit");
        });
        await test.step('Revert pet type from "rabbit" back to "cat"', async () => {
            await page.getByRole('row', { name: "rabbit" }).getByRole('button', { name: 'Edit' }).click();
            await expect(page.locator('#name')).toHaveValue("rabbit");
            await page.locator('#name').fill("cat");
            await page.getByRole('button', { name: 'Update' }).click();
            await expect(page.locator('[id="0"]')).toHaveValue("cat");
        });
    });

    test('Cancel pet type update', async ({ page }) => {
        await page.getByRole('row', { name: "dog" }).getByRole('button', { name: 'Edit' }).click();
        await expect(page.getByRole('heading', { name: 'Edit Pet Type' })).toBeVisible();
        const petTypeInputField = page.locator('#name');
        await petTypeInputField.fill("moose");
        await expect(petTypeInputField).toHaveValue("moose");
        await page.getByRole('button', { name: 'Cancel' }).click();
        await expect(page.getByRole('cell', { name: "dog" })).toBeVisible();
    });

    test('Pet type name is required validation', async ({ page }) => {
        await page.getByRole('row', { name: "lizard" }).getByRole('button', { name: 'Edit' }).click();
        await expect(page.locator('#name')).toHaveValue("lizard");
        await page.locator('#name').clear();
        await expect(page.locator('span.help-block')).toHaveText('Name is required');
        await page.getByRole('button', { name: 'Update' }).click();
        await expect(page.getByRole('heading', { name: 'Edit Pet Type' })).toBeVisible();
        await page.getByRole('button', { name: 'Cancel' }).click();
        await expect(page.getByRole('heading', { name: 'Pet Types' })).toBeVisible();
    });
});
