import { expect } from '@playwright/test';
import { HelperBase } from './helperBase';

export class AddNewPetPage extends HelperBase {
    /**
     * Add a new pet and verify its details on Owner Information page
     * @param name Pet's full name
     * @param petBirthDate Pet's birth date
     * @param petType Pet's type
     */
    async addNewPet(name: string, petBirthDate: Date, petType: string) {
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
    }
}
