import { expect } from '@playwright/test';
import { HelperBase } from './helperBase';

export class VeterinariansPage extends HelperBase {
    /** Go to edit veterinarian page by selecting vet by name and pressing Edit button
     * @param vetName Veterinarian's full name
     */
    async clickEditButtonFor(vetName: string) {
        await this.page.getByRole('row', { name: vetName }).getByRole('button', { name: 'Edit Vet' }).click();
        await expect(this.page.getByRole('heading', { name: 'Edit Veterinarian' })).toBeVisible();
    }
}
