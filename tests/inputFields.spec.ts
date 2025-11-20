import { test, expect } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';

test.describe('Input Fields Tests', () => {
    test.beforeEach(async ({ page }) => {
        const pm = new PageManager(page);
        await pm.navigateTo().homePage();
        await pm.navigateTo().petTypesPage();
    })

    test('Update pet type', async ({ page }) => {
        const pm = new PageManager(page);
        await pm.onPetTypesPage().goToEditPetTypeByPressingEditButton("cat");
        await pm.onPetTypesPage().editPetNameAndVerifyChangeOnPage("rabbit");
        await pm.onPetTypesPage().goToEditPetTypeByPressingEditButton("rabbit");
        await pm.onPetTypesPage().editPetNameAndVerifyChangeOnPage("cat");
    });

    test('Cancel pet type update', async ({ page }) => {
        const pm = new PageManager(page);
        await pm.onPetTypesPage().goToEditPetTypeByPressingEditButton("dog");
        await pm.onPetTypesPage().fillPetTypeNameInputField("moose");
        await pm.onPetTypesPage().cancelChangingPetAndPetTypesPageIsDisplayed();
        await expect(page.getByRole('cell', { name: "dog" })).toBeVisible();
    });

    test('Pet type name is required validation', async ({ page }) => {
        const pm = new PageManager(page);
        await pm.onPetTypesPage().goToEditPetTypeByPressingEditButton("lizard");
        await pm.onPetTypesPage().clearPetTypeNameInputFieldAndVerifyTheTip();
        await page.getByRole('button', { name: 'Update' }).click();
        await expect(page.getByRole('heading', { name: 'Edit Pet Type' })).toBeVisible();
        await pm.onPetTypesPage().cancelChangingPetAndPetTypesPageIsDisplayed();
    });
});
