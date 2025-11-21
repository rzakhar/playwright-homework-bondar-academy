import { expect } from '@playwright/test';
import { HelperBase } from './helperBase';

export class VeterinariansPage extends HelperBase {
    /** Go to edit veterinarian page by selecting vet by name and pressing Edit button
     * @param vetName Veterinarian's full name
     */
    async selectByNameAndGoToEditByPressingEditButton(vetName: string) {
        await this.page.getByRole('row', { name: vetName }).getByRole('button', { name: 'Edit Vet' }).click();
        await expect(this.page.getByRole('heading', { name: 'Edit Veterinarian' })).toBeVisible();
    }

    /** Verify the summary text of selected specialties in the dropdown
     * @param specialties Array of selected specialty names
     */
    async verifySpecialtiesDropdownSummary(specialties: string[]) {
        await expect(this.page.locator('span.selected-specialties')).toHaveText(specialties.join(', '));
    }

    /** Verify the selection state of specialties in the dropdown
     * @param specialties Object with specialty names as keys and their selection state as boolean values
     */
    async verifySpecialtiesDropdownItems(specialties: { [key: string]: boolean }) {
        await this.page.locator('div.dropdown').click();

        for (const [specialty, isSelected] of Object.entries(specialties)) {
            const checkbox = this.page.getByRole('checkbox', { name: specialty });
            if (isSelected) {
                await expect(checkbox).toBeChecked();
            } else {
                await expect(checkbox).not.toBeChecked();
            }
        }
    }

    /** Change the selection state of a specialty in the dropdown
     * @param specialty Name of the specialty
     * @param select Boolean indicating whether to select (true) or deselect (false) the specialty
     */
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

    /** Modify all specialties checkboxes to a given state
     * @param state Boolean indicating the desired state for all checkboxes
     */
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

    /** Get all specialties from the specialties dropdown
     * @returns Array of specialty names in the dropdown
     */
    async getAllSpecialtiesFromDropdown(): Promise<string[]> {
        await this.page.locator('div.dropdown').click();
        const allDropdownLabels = this.page.locator('div.dropdown-content label');
        let specialtiesDropdownItems: string[] = [];
        for (let dropdownLabel of await allDropdownLabels.all()) {
            const specialtyText = await dropdownLabel.textContent();
            if (specialtyText) {
                specialtiesDropdownItems.push(specialtyText);
            }
        }
        return specialtiesDropdownItems;
    }
}
