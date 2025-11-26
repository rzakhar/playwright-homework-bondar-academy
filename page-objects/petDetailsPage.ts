import { test, expect } from '@playwright/test';
import { HelperBase } from './helperBase';

export class PetDetailsPage extends HelperBase {
    /**
     * Verify pet name, owner name and pet type on Pet Details page
     * @param petName Pet's full name
     * @param ownerName Owner's full name
     * @param petType Pet's type
     */
    async verifyPetNameOwnerAndType(petName: string, ownerName: string, petType: string) {
        await test.step(`Verify pet name: ${petName}, owner name: ${ownerName}, pet type: ${petType}`, async () => {
            await expect(this.page.getByRole('textbox', { name: 'Name' })).toHaveValue(petName);
            await expect(this.page.locator('input#owner_name')).toHaveValue(ownerName);
            await expect(this.page.locator('input#type1')).toHaveValue(petType);
        });
    }

    /**
     * Update pet type and verify the updated type on Pet Details page and Pet List
     * @param petName Pet's full name
     * @param newPetType New pet type to be selected
     */
    async updatePetTypeAndVerifyOnPetList(petName: string, newPetType: string) {
        await this.page.getByRole('combobox', { name: 'Type' }).selectOption(newPetType);
        await expect(this.page.locator('input#type1')).toHaveValue(newPetType);
        await expect(this.page.getByRole('combobox', { name: 'Type' })).toHaveValue(newPetType);
        await this.page.getByRole('button', { name: 'Update Pet' }).click();
        await expect(this.page.locator('app-pet-list', { hasText: petName }).getByText(newPetType)).toBeVisible();
    }

    /**
     * Select every pet type from the dropdown and verify selection without saving
     */
    async selectEveryPetTypeAndVerifySelectionWithoutSaving() {
        const petTypes = await this.page.getByRole('combobox', { name: 'Type' }).locator('option').allTextContents();
        for (const petType of petTypes) {
            await this.page.getByRole('combobox', { name: 'Type' }).selectOption(petType);
            await expect(this.page.locator('input#type1')).toHaveValue(petType);
        }
    }
    
    /**
     * Add a new visit for a pet and return the expected date value in visits table
     * @param petName Pet's full name
     * @param description Visit description
     * @param visitDate Date of the visit
     * @returns Expected date value in visits table
     */
    async addNewVisitAndReturnVisitsTableExpectedValue(petName: string, description: string, visitDate: Date): Promise<string> {
        await this.page.locator('app-pet-list').filter({ hasText: petName }).getByRole('button', { name: 'Add Visit' }).click();

        const dateInputFieldExpectedValue = visitDate.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
        const dateVisitsTableExpectedValue = dateInputFieldExpectedValue.replace(/\//g, "-");

        await this.page.getByRole('button', { name: 'Open Calendar' }).click();
        const dateButton = this.page.getByRole('button', { name: dateInputFieldExpectedValue });
        while (!await dateButton.isVisible()) {
            await this.page.getByRole('button', { name: 'Previous month' }).click();
        }
        await dateButton.click();
        await expect(this.page.locator('input[name="date"]')).toHaveValue(dateInputFieldExpectedValue);
        await this.page.locator('input[name="description"]').fill(description);
        await this.page.getByRole('button', { name: 'Add Visit' }).click();

        return dateVisitsTableExpectedValue
    }
}
