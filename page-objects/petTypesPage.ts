import { test, expect } from '@playwright/test';
import { HelperBase } from './helperBase';

export class PetTypesPage extends HelperBase {
    async addNewPetType(petTypeName: string) {
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

    async deletePetType(petTypeName: string) {
        await test.step(`Delete the pet type ${petTypeName}`, async () => {
            this.page.on('dialog', async dialog => {
                expect(dialog.message()).toContain('Delete the pet type?');
                await dialog.accept();
            });
            await this.page.getByRole('button', { name: 'Delete' }).last().click();
            await expect(this.page.getByRole("table").getByRole('textbox').last()).not.toHaveValue(petTypeName);
        });
    }

    async goToEditPetTypeByPressingEditButton(petTypeName: string) {
        await this.page.getByRole('row', { name: petTypeName }).getByRole('button', { name: 'Edit' }).click();
        await expect(this.page.getByRole('heading', { name: 'Edit Pet Type' })).toBeVisible();
        await expect(this.page.locator('#name')).toHaveValue(petTypeName);
    }

    async editPetNameAndVerifyChangeOnPage(newName: string) {
        await this.fillPetTypeNameInputField(newName);
        await this.page.getByRole('button', { name: 'Update' }).click();
        await expect(this.page.locator('[id="0"]')).toHaveValue(newName);
    }

    async fillPetTypeNameInputField(petTypeName: string) {
        const petTypeInputField = this.page.locator('#name');
        await petTypeInputField.fill(petTypeName);
        await expect(petTypeInputField).toHaveValue(petTypeName);
    }

    async clearPetTypeNameInputFieldAndVerifyTheTip() {
        await (this.page.locator('#name')).clear();
        await expect(this.page.locator('span.help-block')).toHaveText('Name is required');
    }

    async cancelChangingPetAndPetTypesPageIsDisplayed() {
        await this.page.getByRole('button', { name: 'Cancel' }).click();
        await expect(this.page.getByRole('heading', { name: 'Pet Types' })).toBeVisible();
    }
}
