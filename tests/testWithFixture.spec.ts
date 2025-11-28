import { test } from '../test-options';
import { expect } from '@playwright/test';

test('test with fixture', async ({ pageManager, tempOwnerWithTeardown, tempPet, tempVisit }) => {
    await pageManager.navigateTo().homePage();
    await pageManager.navigateTo().ownersSearchPage();
    await pageManager.onOwnersPage().verifyOwnerInTable(tempOwnerWithTeardown.fullName, tempOwnerWithTeardown.address, tempOwnerWithTeardown.city, tempOwnerWithTeardown.telephone);
    await pageManager.onOwnersPage().clickOnOwnerName(tempOwnerWithTeardown.fullName);
    await pageManager.onOwnerInformationPage().verifyPetSummary(tempPet.name, tempPet.birthDate, tempPet.type);

    const petVisitsTable = pageManager.page.locator('app-pet-list', { hasText: tempPet.name }).locator('app-visit-list');
    const dateInputFieldExpectedValue = tempVisit.date.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const dateVisitsTableExpectedValue = dateInputFieldExpectedValue.replace(/\//g, "-");
    await expect(petVisitsTable.getByRole('row').nth(1).getByRole('cell').first()).toHaveText(dateVisitsTableExpectedValue);

    await pageManager.onOwnerInformationPage().deleteVisitByDescriptionAndVerifyDeletionFromTheVisitsTable(tempPet.name, tempVisit.description);
    await pageManager.onOwnerInformationPage().deletePetByNameByClickingDeletePetButtonAndVerify(tempPet.name);
});
