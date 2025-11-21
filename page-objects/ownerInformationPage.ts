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
     * Delete a pet by clicking the Delete Pet button and verify the pet is removed
     * @param petName Pet's full name
     */
    async deletePetByNameByClickingDeletePetButtonAndVerify(petName: string) {
        const petSummarySection = this.page.locator('dl.dl-horizontal', { hasText: petName });
        await this.page.getByRole('button', { name: 'Delete Pet' }).click();
        await expect(petSummarySection).toBeHidden();
    }
}
