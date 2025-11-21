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

    async addNewPet(name: string, petBirthDate: Date, petType: string) {
        await this.page.getByRole('button', { name: 'Add New Pet' }).click();
        const petNameTextBox = this.page.getByRole('textbox', { name: 'Name' });
        await petNameTextBox.fill(name);
        await expect(this.page.locator("div.col-sm-10", { has: petNameTextBox }).locator('span')).toHaveClass(/glyphicon-ok/);

        const year = petBirthDate.getFullYear();
        const month = String(petBirthDate.getMonth() + 1).padStart(2, '0');
        const day = String(petBirthDate.getDate()).padStart(2, '0');
        const expectedBirthDateInputValue = `${year}/${month}/${day}`;

        await this.page.getByRole('button', { name: 'Open Calendar' }).click();
        await this.page.getByRole('button', { name: 'Choose month and year' }).click();
        await this.page.getByRole('button', { name: 'Previous 24 years' }).click();
        await this.page.getByRole('button', { name: year.toString() }).click();
        await this.page.getByRole('button', { name: `${month} ${year}` }).click();
        await this.page.getByRole('button', { name: expectedBirthDateInputValue }).click();
        await expect(this.page.locator('input[name="birthDate"]')).toHaveValue(expectedBirthDateInputValue);

        await this.page.getByRole('combobox', { name: 'Type' }).selectOption(petType);
        await this.page.getByRole('button', { name: 'Save Pet' }).click();

        const tomPetSummarySection = this.page.locator('dl.dl-horizontal', { hasText: name });
        const petSummaryRows = tomPetSummarySection.getByRole('definition');
        await expect(petSummaryRows.first()).toHaveText(name);
        await expect(petSummaryRows.nth(1)).toHaveText(`${year}-${month}-${day}`);
        await expect(petSummaryRows.nth(2)).toHaveText(petType);
    }

    async addNewVisitAndReturnVisitsTableExpectedValue(petName: string, description: string, visitDate: Date) {
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

    async deleteVisitByDescription(petName: string, visitDescription: string) {
        const visitsTable = this.page.locator('app-pet-list', { hasText: petName }).locator('app-visit-list');
        await visitsTable.getByRole('row', { name: visitDescription }).getByRole('button', { name: 'Delete Visit' }).click();
        await expect(visitsTable.getByRole('row', { name: visitDescription })).toBeHidden();
    }
}
