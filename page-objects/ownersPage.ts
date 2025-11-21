import { test, expect } from '@playwright/test';
import { HelperBase } from './helperBase';

export class OwnersPage extends HelperBase {
    async goToOwnerPageByClickingOnOwnerName(ownerName: string) {
        await test.step(`Go to owner page by clicking on owner name: ${ownerName}`, async () => {
            await this.page.getByRole('link', { name: ownerName }).click();
            await expect(this.page.locator('b.ownerFullName')).toHaveText(ownerName);
        });
    }

    async searchOwnerByLastName(lastName: string, shouldFindResults: boolean) {
        await this.page.locator('input#lastName').fill(lastName);
        await this.page.getByRole('button', { name: 'Find Owner' }).click();
        const ownerFullNameCells = this.page.locator('td.ownerFullName');
        await this.page.waitForResponse(`https://petclinic-api.bondaracademy.com/petclinic/api/owners?lastName=${lastName}`);
        if (shouldFindResults) {
            for (const ownerCell of await ownerFullNameCells.all()) {
                await expect(ownerCell).toContainText(lastName);
            }
        } else {
            await expect(this.page.locator('div').getByText(`No owners with LastName starting with "${lastName}"`)).toBeVisible();
        }
    }
}
