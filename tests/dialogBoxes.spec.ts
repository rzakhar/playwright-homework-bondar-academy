import { test } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';

test('Add and delete pet type', async ({ page }) => {
    const pm = new PageManager(page);
    await pm.navigateTo().homePage();
    await pm.navigateTo().petTypesPage();
    await pm.onPetTypesPage().addNewPetTypeAndVerifyNewRowInTheTypesTable('pig');
    await pm.onPetTypesPage().deletePetTypeAndVerifyDeletionFromTheTypesTable('pig');
});
