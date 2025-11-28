import { faker } from '@faker-js/faker';
import { test } from '../test-options';
import { expect } from '@playwright/test';

test('Visual testing', async ({ pageManager }) => {
    const newOwnerFirstName = faker.person.firstName();
    const newOwnerLastName = faker.person.lastName();
    const newOwnerAddress = faker.location.streetAddress();
    const newOwnerCity = faker.location.city();
    const newOwnerTelephone = faker.string.numeric(10)
    await pageManager.navigateTo().homePage();
    await pageManager.navigateTo().newOwnerPage();
    await expect(pageManager.page.getByRole('button', { name: 'Add Owner' })).toHaveScreenshot();
    await pageManager.onAddNewOwnerPage().fillNewOwnerDetails(newOwnerFirstName, newOwnerLastName, newOwnerAddress, newOwnerCity, newOwnerTelephone);
    await expect(pageManager.page.getByRole('button', { name: 'Add Owner' })).toHaveScreenshot();
});
