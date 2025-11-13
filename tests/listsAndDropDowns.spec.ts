import { test, expect, Page, Locator } from '@playwright/test';

test.describe('Checkboxes Tests', () => {
    test.beforeEach(async ({ page }) => {
        await test.step('Open the home page', async () => {
            await page.goto('/')
            await expect(page.locator('.title')).toHaveText('Welcome to Petclinic')
        });
        await test.step('Navigate to Owners Search page', async () => {
            await page.getByRole('button', { name: 'Owners' }).click();
            await page.getByRole('link', { name: 'Search' }).click();
            await expect(page.getByRole('heading', { name: 'Owners' })).toBeVisible();
        });
    })

    test('Validate selected pet types from the list', async ({ page }) => {
        await page.getByRole('link', { name: "George Franklin" }).click();
        await expect(page.locator('b.ownerFullName')).toHaveText("George Franklin");
        
        await page.locator("app-pet-list", { hasText: "Leo" }).getByRole('button', { name: 'Edit Pet' }).click();
        await expect(page.getByRole('heading', { name: "Pet" })).toBeVisible();
        await expect(page.locator('input#owner_name')).toHaveValue("George Franklin");
        await expect(page.locator('input#type1')).toHaveValue("cat");

        const petTypes = await page.getByRole('combobox', { name: 'Type' }).locator('option').allTextContents();
        for (const petType of petTypes) {
            await page.getByRole('combobox', { name: 'Type' }).selectOption(petType);
            await expect(page.locator('input#type1')).toHaveValue(petType);
        }
    });

    test('Validate the pet type update', async ({ page }) => {
        await page.getByRole('link', { name: "Eduardo Rodriquez" }).click();

        await test.step(`Change Rosy pet type from dog to bird`, async () => {
            await page.locator("app-pet-list", { hasText: "Rosy" }).getByRole('button', { name: 'Edit Pet' }).click();
            await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue("Rosy");
            await expect(page.locator('input#type1')).toHaveValue("dog");

            await page.getByRole('combobox', { name: 'Type' }).selectOption("bird");
            await expect(page.locator('input#type1')).toHaveValue("bird");
            await expect(page.getByRole('combobox', { name: 'Type' })).toHaveValue("bird");
            await page.getByRole('button', { name: 'Update Pet' }).click();
            await expect(page.locator('app-pet-list', { hasText: "Rosy" }).getByText("bird")).toBeVisible();
        });

        await test.step(`Revert Rosy pet type back from bird to dog`, async () => {
            await page.locator("app-pet-list", { hasText: "Rosy" }).getByRole('button', { name: 'Edit Pet' }).click();
            await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue("Rosy");
            await expect(page.locator('input#type1')).toHaveValue("bird");

            await page.getByRole('combobox', { name: 'Type' }).selectOption("dog");
            await expect(page.locator('input#type1')).toHaveValue("dog");
            await expect(page.getByRole('combobox', { name: 'Type' })).toHaveValue("dog");
            await page.getByRole('button', { name: 'Update Pet' }).click();
            await expect(page.locator('dl.dl-horizontal').filter({ hasText: "Rosy" }).getByText("dog")).toBeVisible();
        });
    });
});
