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

    /**
     * Verify owner details in the owners table
     * @param ownerFullName Owner's full name
     * @param address Owner's address
     * @param city Owner's city
     * @param telephone Owner's telephone
     */
    async verifyOwnerInTable(ownerFullName: string, address: string, city: string, telephone: string) {
        const ownerRow = this.page.getByRole('row', { name: ownerFullName });
        await expect(ownerRow.getByRole('cell').first()).toHaveText(ownerFullName);
        await expect(ownerRow.getByRole('cell').nth(1)).toHaveText(address);
        await expect(ownerRow.getByRole('cell').nth(2)).toHaveText(city);
        await expect(ownerRow.getByRole('cell').nth(3)).toHaveText(telephone);
    }

    /**
     * Verify that an owner is not visible in the owners table
     * @param ownerFullName Owner's full name
     */
    async verifyOwnerIsNotVisible(ownerFullName: string) {
        await expect(this.page.getByRole("row", { name: ownerFullName })).not.toBeVisible();
    }
}
