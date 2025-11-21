import { test, expect } from '@playwright/test';
import { HelperBase } from './helperBase';

export class SpecialtiesPage extends HelperBase {
    /**
     * Rename a specialty and verify the change on the page
     * @param oldSpecialtyName Current name of the specialty
     * @param newSpecialtyName New name for the specialty
     */
    async renameSpecialtyAndVerifySpecialtiesTableUpdate(oldSpecialtyName: string, newSpecialtyName: string) {
        await test.step(`Update specialty name from ${oldSpecialtyName} to ${newSpecialtyName}`, async () => {
            await this.page.getByRole('row', { name: oldSpecialtyName }).getByRole('button', { name: 'Edit' }).click();
            await expect(this.page.getByRole('heading', { name: 'Edit Specialty' })).toBeVisible();
            await expect(this.page.getByRole('textbox')).toHaveValue(oldSpecialtyName);
            await this.page.getByRole('textbox').fill(newSpecialtyName);
            await this.page.getByRole('button', { name: 'Update' }).click();
            await expect(this.page.locator('input[id="1"]')).toHaveValue(newSpecialtyName);
        });
    }

    /**
     * Add a new specialty and verify it appears in the specialties list
     * @param specialtyName Name of the new specialty to be added
     */
    async addSpecialtyAndVerifySpecialtiesTableUpdate(specialtyName: string) {
        await this.page.getByRole('button', { name: 'Add' }).click();
        await this.page.locator("input#name").fill(specialtyName);
        await this.page.getByRole('button', { name: 'Save' }).click();
        await expect(this.page.getByRole('row', { name: specialtyName })).toBeVisible();
    }

    /**
     * Delete a specialty and verify it is removed from the specialties list
     * @param specialtyName Name of the specialty to be deleted
     */
    async deleteSpecialtyAndVerifySpecialtiesTableUpdate(specialtyName: string) {
        await this.page.getByRole('row', { name: specialtyName }).getByRole('button', { name: 'Delete' }).click();
        await expect(this.page.getByRole('row', { name: specialtyName })).not.toBeVisible();
    }

    /**
     * Get all specialties from the specialties table
     * @returns Array of specialty names
     */
    async getAllSpecialties(): Promise<string[]> {
        let allSpecialties = [];
        const specialtyRows = this.page.getByRole('row').filter({ has: this.page.getByRole('textbox') });
        for (let specialtyRow of await specialtyRows.all()) {
            const specialtyName = await specialtyRow.getByRole('cell').getByRole('textbox').inputValue();
            allSpecialties.push(specialtyName);
        };
        return allSpecialties;
    }
}
