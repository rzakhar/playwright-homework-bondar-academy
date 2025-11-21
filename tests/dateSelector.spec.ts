import { test, expect } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';

test.describe('Date Selectors Tests', () => {
    test.beforeEach(async ({ page }) => {
        const pm = new PageManager(page);
        await pm.navigateTo().homePage();
        await pm.navigateTo().ownersSearchPage();
    })

    test("Select the desired date in the calendar widget", async ({ page }) => {
        const pm = new PageManager(page);
        await pm.onOwnersPage().goToOwnerPageByClickingOnOwnerName("Harold Davis");
        await pm.onPetDetailsPage().addNewPet('Tom', new Date(2014, 4, 20), 'dog');
        await pm.onOwnerInformationPage().deletePetByName('Tom');
    });

    test("Select the dates of visits and validate dates order", async ({ page }) => {
        const pm = new PageManager(page);
        await pm.onOwnersPage().goToOwnerPageByClickingOnOwnerName("Jean Coleman");
        const currentDateVisitsTableExpectedValue = await pm.onPetDetailsPage().addNewVisitAndReturnVisitsTableExpectedValue('Samantha', 'dermatologists visit', new Date());

        const samanthaVisitsTable = page.locator('app-pet-list', { hasText: "Samantha" }).locator('app-visit-list');
        await expect(samanthaVisitsTable.getByRole('row').nth(1).getByRole('cell').first()).toHaveText(currentDateVisitsTableExpectedValue);

        var fortyFiveDaysAgo = new Date()
        fortyFiveDaysAgo.setDate(fortyFiveDaysAgo.getDate() - 45);
        const fortyFiveDaysAgoVisitsTableExpectedValue = await pm.onPetDetailsPage().addNewVisitAndReturnVisitsTableExpectedValue('Samantha', 'massage therapy', fortyFiveDaysAgo);
       
        await expect(samanthaVisitsTable.getByRole('row').nth(1).getByRole('cell').first()).toHaveText(currentDateVisitsTableExpectedValue);
        await expect(samanthaVisitsTable.getByRole('row').nth(2).getByRole('cell').first()).toHaveText(fortyFiveDaysAgoVisitsTableExpectedValue);

        await pm.onPetDetailsPage().deleteVisitByDescription('Samantha', 'dermatologists visit');
        await pm.onPetDetailsPage().deleteVisitByDescription('Samantha', 'massage therapy');
    });
});
