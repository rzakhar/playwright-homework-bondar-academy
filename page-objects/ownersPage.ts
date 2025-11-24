import { test, expect } from '@playwright/test';
import { HelperBase } from './helperBase';

export class OwnersPage extends HelperBase {
    /**
     * Go to owner page by clicking on owner name
     * @param ownerName Owner's full name
     */
    async clickOnOwnerName(ownerName: string) {
        await test.step(`Go to owner page by clicking on owner name: ${ownerName}`, async () => {
            await this.page.getByRole('link', { name: ownerName }).click();
            await expect(this.page.locator('b.ownerFullName')).toHaveText(ownerName);
        });
    }

    /**
     * Search owner by last name and verify if results are found or not
     * @param lastName Owner's last name
     * @param shouldFindResults Whether results are expected or not
     */
    async searchOwnerByLastName(lastName: string, shouldFindResults: boolean) {
        await test.step(`Search owner by last name: ${lastName}`, async () => {
            await this.page.locator('input#lastName').fill(lastName);
            await this.page.getByRole('button', { name: 'Find Owner' }).click();
            await this.page.waitForResponse(`https://petclinic-api.bondaracademy.com/petclinic/api/owners?lastName=${lastName}`);
        });
        await test.step(`Verify search results for last name: ${lastName}`, async () => {
            if (shouldFindResults) {
                const ownerFullNameCells = this.page.locator('td.ownerFullName');
                for (const ownerCell of await ownerFullNameCells.all()) {
                    await expect(ownerCell).toContainText(lastName);
                }
            } else {
                await expect(this.page.locator('div').getByText(`No owners with LastName starting with "${lastName}"`)).toBeVisible();
            }
        });
    }
}
