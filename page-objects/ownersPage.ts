import { test, expect } from '@playwright/test';
import { HelperBase } from './helperBase';

export class OwnersPage extends HelperBase {
    async goToOwnerPageByClickingOnOwnerName(ownerName: string) {
        await test.step(`Go to owner page by clicking on owner name: ${ownerName}`, async () => {
            await this.page.getByRole('link', { name: ownerName }).click();
            await expect(this.page.locator('b.ownerFullName')).toHaveText(ownerName);
        });
    }
}
