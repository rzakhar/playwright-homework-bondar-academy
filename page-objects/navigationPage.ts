import { test, expect } from '@playwright/test';
import { HelperBase } from './helperBase';

export class NavigationPage extends HelperBase {

    /**
     * Navigate to the home page using the baseURL
     */
    async homePage() {
        await test.step('Open the home page', async () => {
            await this.page.goto('/')
            await expect(this.page.locator('.title')).toHaveText('Welcome to Petclinic')
        });
    }

    /**
     * Navigate to the Veterinarians page using the navigation menu
     */
    async veterinariansPage() {
        await test.step('Navigate to Veterinarians page', async () => {
            await this.page.getByRole('button', { name: 'Veterinarians' }).click();
            await this.page.getByRole('link', { name: 'All' }).click();
            await expect(this.page.getByRole('heading', { name: 'Veterinarians' })).toBeVisible();
        });
    }

    /**
     * Navigate to the Owners Search page using the navigation menu
     */
    async ownersSearchPage() {
        await test.step('Navigate to Owners Search page', async () => {
            await this.page.getByRole('button', { name: 'Owners' }).click();
            await this.page.getByRole('link', { name: 'Search' }).click();
            await expect(this.page.getByRole('heading', { name: 'Owners' })).toBeVisible();
        });
    }

    /**
     * Navigate to the Pet Types page using the navigation menu
     */
    async petTypesPage() {
        await test.step('Navigate to Pet Types page', async () => {
            await this.page.getByRole('link', { name: 'Pet Types' }).click();
            await expect(this.page.getByRole('heading', { name: 'Pet Types' })).toBeVisible();
        });
    }

    /**
     * Navigate to the Specialties page using the navigation menu
     */
    async specialtiesPage() {
        await test.step('Navigate to Specialties page', async () => {
            await this.page.getByRole('link', { name: 'Specialties' }).click();
            await expect(this.page.getByRole('heading', { name: 'Specialties' })).toBeVisible();
        });
    }
}
