import { test } from '../test-options';
import { expect } from '@playwright/test';

test('test with fixture', async ({ pageManager, tempOwnerWithTeardown, tempPet, tempVisit }) => {
    const [, ownerName, ownerAddress, ownerCity, ownerTelephone] = tempOwnerWithTeardown;
    const [, , petName, petBirthDate, petType] = tempPet;
    const [, visitDescription, visitDate] = tempVisit;

    await pageManager.navigateTo().homePage();
    await pageManager.navigateTo().ownersSearchPage();
    await pageManager.onOwnersPage().verifyOwnerInTable(ownerName, ownerAddress, ownerCity, ownerTelephone);
    await pageManager.onOwnersPage().clickOnOwnerName(ownerName);
    await pageManager.onOwnerInformationPage().verifyPetSummary(petName, petBirthDate, petType);

    const petVisitsTable = pageManager.page.locator('app-pet-list', { hasText: petName }).locator('app-visit-list');
    const dateInputFieldExpectedValue = visitDate.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const dateVisitsTableExpectedValue = dateInputFieldExpectedValue.replace(/\//g, "-");
    await expect(petVisitsTable.getByRole('row').nth(1).getByRole('cell').first()).toHaveText(dateVisitsTableExpectedValue);

    await pageManager.onOwnerInformationPage().deleteVisitByDescriptionAndVerifyDeletionFromTheVisitsTable(petName, visitDescription);
    await pageManager.onOwnerInformationPage().deletePetByNameByClickingDeletePetButtonAndVerify(petName);
});
