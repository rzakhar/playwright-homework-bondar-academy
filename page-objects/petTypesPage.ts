import { test, expect } from '@playwright/test';
import { HelperBase } from './helperBase';

export class PetTypesPage extends HelperBase {
    /**
     * Add a new pet type and verify it appears in the pet types list
     * @param petTypeName Name of the new pet type to be added
     */
    async addNewPetTypeAndVerifyNewRowInTheTypesTable(petTypeName: string) {
        await test.step(`Add new pet type ${petTypeName}`, async () => {
            await this.page.getByRole('button', { name: 'Add' }).click();
            await expect(this.page.getByRole('heading', { name: 'New Pet Type' })).toBeVisible();
            await expect(this.page.locator('label', { hasText: 'Name' })).toBeVisible();
            await expect(this.page.locator('input#name')).toBeVisible();
            await this.page.locator('input#name').fill(petTypeName);
            await this.page.getByRole('button', { name: 'Save' }).click();
            await expect(this.page.getByRole("table").getByRole('textbox').last()).toHaveValue(petTypeName);
        });
    }

    /**
     * Delete a pet type and verify it is removed from the pet types list
     * @param petTypeName Name of the pet type to be deleted
     */
    async deletePetTypeAndVerifyDeletionFromTheTypesTable(petTypeName: string) {
        await test.step(`Delete the pet type ${petTypeName}`, async () => {
            this.page.on('dialog', async dialog => {
                expect(dialog.message()).toContain('Delete the pet type?');
                await dialog.accept();
            });
            await this.page.getByRole('button', { name: 'Delete' }).last().click();
            await expect(this.page.getByRole("table").getByRole('textbox').last()).not.toHaveValue(petTypeName);
        });
    }

    /**
     * Go to edit pet type page by clicking on Edit button
     * @param petTypeName Name of the pet type to be edited
     */
    async goToEditPetTypeByPressingEditButton(petTypeName: string) {
        await this.page.getByRole('row', { name: petTypeName }).getByRole('button', { name: 'Edit' }).click();
        await expect(this.page.getByRole('heading', { name: 'Edit Pet Type' })).toBeVisible();
        await expect(this.page.locator('#name')).toHaveValue(petTypeName);
    }

    /**
     * Edit pet type name and click Update button
     * @param newName New name for the pet type
     */
    async editPetNameAndClickUpdateButton(newName: string) {
        await this.fillPetTypeNameInputField(newName);
        await this.page.getByRole('button', { name: 'Update' }).click();
    }

    /**
     * Fill pet type name input field and verify its value
     * @param petTypeName Name to be filled in the pet type input field
     */
    async fillPetTypeNameInputField(petTypeName: string) {
        const petTypeInputField = this.page.locator('#name');
        await petTypeInputField.fill(petTypeName);
        await expect(petTypeInputField).toHaveValue(petTypeName);
    }

    /**
     * Clear pet type name input field and verify the validation tip
     */
    async clearPetTypeNameInputFieldAndVerifyTheTip() {
        await (this.page.locator('#name')).clear();
        await expect(this.page.locator('span.help-block')).toHaveText('Name is required');
    }

    /**
     * Cancel changing pet type and verify Pet Types page is displayed
     */
    async cancelChangingPetAndPetTypesPageIsDisplayed() {
        await this.page.getByRole('button', { name: 'Cancel' }).click();
        await expect(this.page.getByRole('heading', { name: 'Pet Types' })).toBeVisible();
    }
}
