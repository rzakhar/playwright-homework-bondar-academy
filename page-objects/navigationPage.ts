import { test, expect } from '@playwright/test';
import { HelperBase } from './helperBase';

export class NavigationPage extends HelperBase {

    async homePage() {
        await test.step('Open the home page', async () => {
            await this.page.goto('/')
            await expect(this.page.locator('.title')).toHaveText('Welcome to Petclinic')
        });
    }

    async veterinariansPage() {
        await test.step('Navigate to Veterinarians page', async () => {
            await this.page.getByRole('button', { name: 'Veterinarians' }).click();
            await this.page.getByRole('link', { name: 'All' }).click();
            await expect(this.page.getByRole('heading', { name: 'Veterinarians' })).toBeVisible();
        });
    }

    async ownersSearchPage() {
        await test.step('Navigate to Owners Search page', async () => {
            await this.page.getByRole('button', { name: 'Owners' }).click();
            await this.page.getByRole('link', { name: 'Search' }).click();
            await expect(this.page.getByRole('heading', { name: 'Owners' })).toBeVisible();
        });
    }

    async petTypesPage() {
        await this.page.getByRole('link', { name: 'Pet Types' }).click();
        await expect(this.page.getByRole('heading', { name: 'Pet Types' })).toBeVisible();
    }

    async specialtiesPage() {
        await this.page.getByRole('link', { name: 'Specialties' }).click();
        await expect(this.page.getByRole('heading', { name: 'Specialties' })).toBeVisible();
    }
}
