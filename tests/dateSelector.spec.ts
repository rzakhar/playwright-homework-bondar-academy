import { test, expect } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';
import { RandomDataGenerator } from '../utils/randomDataGenerator';

test.describe('Date Selectors Tests', () => {
    test.beforeEach(async ({ page }) => {
        const pm = new PageManager(page);
        await pm.navigateTo().homePage();
        await pm.navigateTo().ownersSearchPage();
    });

    test("Select the desired date in the calendar widget", async ({ page }) => {
        const pm = new PageManager(page);
        await pm.onOwnersPage().clickOnOwnerName("Harold Davis");
        await pm.onOwnerInformationPage().clickAddNewPet();
        const newPetName = new RandomDataGenerator().getRandomPetName();
        await pm.onAddNewPetPage().addNewPet(newPetName, new Date(2014, 4, 20), 'dog');
        await pm.onOwnerInformationPage().verifyPetSummary(newPetName, new Date(2014, 4, 20), 'dog');
        await pm.onOwnerInformationPage().deletePetByNameByClickingDeletePetButtonAndVerify(newPetName);
    });

    test("Select the dates of visits and validate dates order", async ({ page }) => {
        const firstVisitDescription = new RandomDataGenerator().getRandomPetVisitDescription();
        const secondVisitDescription = new RandomDataGenerator().getRandomPetVisitDescription();

        const pm = new PageManager(page);
        await pm.onOwnersPage().clickOnOwnerName("Jean Coleman");
        const currentDateVisitsTableExpectedValue = await pm.onPetDetailsPage().addNewVisitAndReturnVisitsTableExpectedValue('Samantha', firstVisitDescription, new Date());

        const samanthaVisitsTable = page.locator('app-pet-list', { hasText: "Samantha" }).locator('app-visit-list');
        await expect(samanthaVisitsTable.getByRole('row').nth(1).getByRole('cell').first()).toHaveText(currentDateVisitsTableExpectedValue);

        let fortyFiveDaysAgo = new Date()
        fortyFiveDaysAgo.setDate(fortyFiveDaysAgo.getDate() - 45);
        await pm.onPetDetailsPage().addNewVisitAndReturnVisitsTableExpectedValue('Samantha', secondVisitDescription, fortyFiveDaysAgo);

        const firstDisplayedVisitDateString = await samanthaVisitsTable.getByRole('row').nth(3).getByRole('cell').first().textContent()!;
        const secondDisplayedVisitDateString = await samanthaVisitsTable.getByRole('row').nth(4).getByRole('cell').first().textContent()!;
        const firstDisplayedVisitDate = new Date(firstDisplayedVisitDateString!);
        const secondDisplayedVisitDate = new Date(secondDisplayedVisitDateString!);
        expect(secondDisplayedVisitDate.getTime()).toBeLessThan(firstDisplayedVisitDate.getTime());

        await pm.onPetDetailsPage().deleteVisitByDescriptionAndVerifyDeletionFromTheVisitsTable('Samantha', firstVisitDescription);
        await pm.onPetDetailsPage().deleteVisitByDescriptionAndVerifyDeletionFromTheVisitsTable('Samantha', secondVisitDescription);
    });
});
