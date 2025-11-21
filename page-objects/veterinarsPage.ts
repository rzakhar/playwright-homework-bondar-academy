import { test, expect } from '@playwright/test';
import { HelperBase } from './helperBase';

export class VeterinarsPage extends HelperBase {
    async selectByNameAndGoToEditByPressingEditButton(vetName: string) {
        await this.page.getByRole('row', { name: vetName }).getByRole('button', { name: 'Edit Vet' }).click();
        await expect(this.page.getByRole('heading', { name: 'Edit Veterinarian' })).toBeVisible();
    }

    async verifySpecialtiesDropdownSummary(specialties: string[]) {
        await expect(this.page.locator('span.selected-specialties')).toHaveText(specialties.join(', '));
    }

    async verifySpecialtiesDropdownItems(specialties: { [key: string]: boolean }) {
        await this.page.locator('span.selected-specialties').click();

        for (const [specialty, isSelected] of Object.entries(specialties)) {
            const checkbox = this.page.getByRole('checkbox', { name: specialty });
            if (isSelected) {
                await expect(checkbox).toBeChecked();
            } else {
                await expect(checkbox).not.toBeChecked();
            }
        }
    }

    async changeSpecialtySelection(specialty: string, select: boolean) {
        const checkbox = this.page.getByRole('checkbox', { name: specialty });
        if (select) {
            await checkbox.check();
            await expect(checkbox).toBeChecked();
        } else {
            await checkbox.uncheck();
            await expect(checkbox).not.toBeChecked();
        }
    }

    async modifyAllSpecialtiesCheckboxesToOneState(state: boolean) {
        const allCheckboxes = this.page.getByRole('checkbox');
        for (const checkbox of await allCheckboxes.all()) {
            if (state) {
                await checkbox.check();
                await expect(checkbox).toBeChecked();
            } else {
                await checkbox.uncheck();
                await expect(checkbox).not.toBeChecked();
            }
        }
    }

    async getAllSpecialtiesFromDropdown(): Promise<string[]> {
        await this.page.locator('span.selected-specialties').click();
        var specialties: string[] = [];
        const allCheckboxes = this.page.getByRole('checkbox');
        for (const checkbox of await allCheckboxes.all()) {
            const specialtyName = await checkbox.getAttribute('name')!;
            specialties.push(specialtyName!);
        }
        return specialties;
    }
}
