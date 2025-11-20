// or operations such as adding a new pet, updating pet details, add/update visit details
import { test, expect } from '@playwright/test';
import { HelperBase } from './helperBase';

export class PetDetailsPage extends HelperBase {
    async verifyPetNameOwnerAndType(petName: string, ownerName: string, petType: string) {
        await test.step(`Verify pet name: ${petName}, owner name: ${ownerName}, pet type: ${petType}`, async () => {
            await expect(this.page.getByRole('textbox', { name: 'Name' })).toHaveValue(petName);
            await expect(this.page.locator('input#owner_name')).toHaveValue(ownerName);
            await expect(this.page.locator('input#type1')).toHaveValue(petType);
        });
    }

    async updatePetTypeAndVerifyOnPetList(petName: string, newPetType: string) {
        await this.page.getByRole('combobox', { name: 'Type' }).selectOption(newPetType);
        await expect(this.page.locator('input#type1')).toHaveValue(newPetType);
        await expect(this.page.getByRole('combobox', { name: 'Type' })).toHaveValue(newPetType);
        await this.page.getByRole('button', { name: 'Update Pet' }).click();
        await expect(this.page.locator('app-pet-list', { hasText: petName }).getByText(newPetType)).toBeVisible();
    }

    async selectEveryPetTypeAndVerifySelectionWithoutSaving() {
        const petTypes = await this.page.getByRole('combobox', { name: 'Type' }).locator('option').allTextContents();
        for (const petType of petTypes) {
            await this.page.getByRole('combobox', { name: 'Type' }).selectOption(petType);
            await expect(this.page.locator('input#type1')).toHaveValue(petType);
        }
    }
}
