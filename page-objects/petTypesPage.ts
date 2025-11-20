import { test, expect } from '@playwright/test';
import { HelperBase } from './helperBase';

export class PetTypesPage extends HelperBase {
    async addNewPetType(petTypeName: string) {
        await test.step(`Add new pet type ${petTypeName}`, async () => {
            const lastTableTextBox = this.page.getByRole("table").getByRole('textbox').last();
            await this.page.getByRole('button', { name: 'Add' }).click();
            await expect(this.page.getByRole('heading', { name: 'New Pet Type' })).toBeVisible();
            await expect(this.page.locator('label', { hasText: 'Name' })).toBeVisible();
            await expect(this.page.locator('input#name')).toBeVisible();
            await this.page.locator('input#name').fill(petTypeName);
            await this.page.getByRole('button', { name: 'Save' }).click();
            await expect(lastTableTextBox).toHaveValue(petTypeName);
        });
    }

    async deletePetType(petTypeName: string) {
        await test.step(`Delete the pet type ${petTypeName}`, async () => {
            const lastTableTextBox = this.page.getByRole("table").getByRole('textbox').last();
            this.page.on('dialog', async dialog => {
                expect(dialog.message()).toContain('Delete the pet type?');
                await dialog.accept();
            });
            await this.page.getByRole('button', { name: 'Delete' }).last().click();
            await expect(lastTableTextBox).not.toHaveValue(petTypeName);
        });
    }
}
