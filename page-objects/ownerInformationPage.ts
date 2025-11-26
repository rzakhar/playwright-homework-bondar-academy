import { expect } from '@playwright/test';
import { HelperBase } from './helperBase';

export class OwnerInformationPage extends HelperBase {
    /**
     * Go to pet details page by clicking on Edit Pet button
     * @param petName Pet's full name
     */
    async goToPetDetailsPageByClickingOnEditPetButton(petName: string) {
        await this.page.locator("app-pet-list", { hasText: petName }).getByRole('button', { name: 'Edit Pet' }).click();
        await expect(this.page.getByRole('heading', { name: "Pet" })).toBeVisible();
    }

    /** 
     * Click on Add New Pet button
     */
    async clickAddNewPet() {
        await this.page.getByRole('button', { name: 'Add New Pet' }).click();
    }

    /**
     * Verify pet's summary details on Owner Information page
     * @param name Pet's full name
     * @param petBirthDate Pet's birth date
     * @param petType Pet's type
     */
    async verifyPetSummary(name: string, petBirthDate: Date, petType: string) {
        const year = petBirthDate.getFullYear();
        const month = String(petBirthDate.getMonth() + 1).padStart(2, '0');
        const day = String(petBirthDate.getDate()).padStart(2, '0');

        const petSummarySection = this.page.locator('dl.dl-horizontal', { hasText: name });
        const petSummaryRows = petSummarySection.getByRole('definition');
        await expect(petSummaryRows.first()).toHaveText(name);
        await expect(petSummaryRows.nth(1)).toHaveText(`${year}-${month}-${day}`);
        await expect(petSummaryRows.nth(2)).toHaveText(petType);
    }

    /**
     * Delete a pet by clicking the Delete Pet button and verify the pet is removed
     * @param petName Pet's full name
     */
    async deletePetByNameByClickingDeletePetButtonAndVerify(petName: string) {
        const petSummarySection = this.page.locator('dl.dl-horizontal', { hasText: petName });
        await this.page.getByRole('button', { name: 'Delete Pet' }).click();
        await expect(petSummarySection).toBeHidden();
    }

    /**
     * Delete a visit by its description and verify it's removed from visits table
     * @param petName Pet's full name
     * @param visitDescription Description of the visit to be deleted
     */
    async deleteVisitByDescriptionAndVerifyDeletionFromTheVisitsTable(petName: string, visitDescription: string) {
        const visitsTable = this.page.locator('app-pet-list', { hasText: petName }).locator('app-visit-list');
        await visitsTable.getByRole('row', { name: visitDescription }).getByRole('button', { name: 'Delete Visit' }).click();
        await expect(visitsTable.getByRole('row', { name: visitDescription })).toBeHidden();
    }
}
