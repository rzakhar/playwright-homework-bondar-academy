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
        const ownerName = "George Franklin";
        await page.getByRole('link', { name: ownerName }).click();
        await expect(page.locator('b.ownerFullName')).toHaveText(ownerName);
        
        await page.locator("dl.dl-horizontal").filter({ hasText: "Leo" }).getByRole('button', { name: 'Edit Pet' }).click();
        await expect(page.getByRole('heading', { name: "Pet" })).toBeVisible();
        await expect(page.locator('input#owner_name')).toHaveValue(ownerName);
        await expect(page.locator('input#type1')).toHaveValue("cat");

        const petTypes = ['cat', 'dog', 'lizard', 'snake', 'bird', 'hamster'];
        for (const petType of petTypes) {
            await page.getByRole('combobox', { name: 'Type' }).selectOption(petType);
            await expect(page.locator('input#type1')).toHaveValue(petType);
        }
    });

    test('Validate the pet type update', async ({ page }) => {
        const ownerName = "Eduardo Rodriquez";
        await page.getByRole('link', { name: ownerName }).click();

        const petName = "Rosy";
        const petType = "dog";
        const newPetType = "bird";

        await test.step(`Change ${petName} pet type from ${petType} to ${newPetType}`, async () => {
            await page.locator("dl.dl-horizontal").filter({ hasText: petName }).getByRole('button', { name: 'Edit Pet' }).click();
            await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue(petName);
            await expect(page.locator('input#type1')).toHaveValue(petType);

            await page.getByRole('combobox', { name: 'Type' }).selectOption(newPetType);
            await expect(page.locator('input#type1')).toHaveValue(newPetType);
            await expect(page.getByRole('combobox', { name: 'Type' })).toHaveValue(newPetType);
            await page.getByRole('button', { name: 'Update Pet' }).click();
            await expect(page.locator('dl.dl-horizontal').filter({ hasText: petName }).getByText(newPetType)).toBeVisible();
        });

        await test.step(`Revert ${petName} pet type back from ${newPetType} to ${petType}`, async () => {
            await page.locator("dl.dl-horizontal").filter({ hasText: petName }).getByRole('button', { name: 'Edit Pet' }).click();
            await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue(petName);
            await expect(page.locator('input#type1')).toHaveValue(newPetType);

            await page.getByRole('combobox', { name: 'Type' }).selectOption(petType);
            await expect(page.locator('input#type1')).toHaveValue(petType);
            await expect(page.getByRole('combobox', { name: 'Type' })).toHaveValue(petType);
            await page.getByRole('button', { name: 'Update Pet' }).click();
            await expect(page.locator('dl.dl-horizontal').filter({ hasText: petName }).getByText(petType)).toBeVisible();
        });
    });
});
