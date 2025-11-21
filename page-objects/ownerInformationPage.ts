import { test, expect } from '@playwright/test';
import { HelperBase } from './helperBase';

export class OwnerInformationPage extends HelperBase {
    async goToPetDetailsPageByClickingOnEditPetButton(petName: string) {
        await this.page.locator("app-pet-list", { hasText: petName }).getByRole('button', { name: 'Edit Pet' }).click();
        await expect(this.page.getByRole('heading', { name: "Pet" })).toBeVisible();
    }

    async deletePetByName(petName: string) {
        const petSummarySection = this.page.locator('dl.dl-horizontal', { hasText: petName });
        await this.page.getByRole('button', { name: 'Delete Pet' }).click();
        await expect(petSummarySection).toBeHidden();
    }
}
