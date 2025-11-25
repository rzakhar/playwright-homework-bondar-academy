import { test, expect } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';
import owners from '../test-data/owners.json';
import tenSpecialties from '../test-data/tenSpecialties.json';
import { faker } from '@faker-js/faker';

test('mocking API request', async ({ page }) => {
    await page.route('*/**/api/owners', async route => {
        await route.fulfill({
            body: JSON.stringify(owners),
        });
    });
    await page.route(`*/**/api/owners/${owners[0].id}`, async route => {
        await route.fulfill({
            body: JSON.stringify(owners[0]),
        });
    });
    const pm = new PageManager(page);

    await test.step('Verify owners count on owners search page', async () => {
        await pm.navigateTo().homePage();
        await pm.navigateTo().ownersSearchPage();
        await expect(page.locator('td.ownerFullName')).toHaveCount(owners.length);
    });
    const expectedFirstOwnerFullName = owners[0].firstName + ' ' + owners[0].lastName;
    await test.step('Verify first owner details on owners search page', async () => {
        const firstOwnerRow = page.getByRole('row', { name: expectedFirstOwnerFullName });
        await expect(firstOwnerRow.getByRole('cell').first()).toHaveText(expectedFirstOwnerFullName);
        await expect(firstOwnerRow.getByRole('cell').nth(1)).toHaveText(owners[0].address);
        await expect(firstOwnerRow.getByRole('cell').nth(2)).toHaveText(owners[0].city);
        await expect(firstOwnerRow.getByRole('cell').nth(3)).toHaveText(owners[0].telephone);
        await expect(firstOwnerRow.getByRole('cell').nth(4)).toHaveText(' ' + owners[0].pets.map(p => p.name).join('  ') + ' ');
    });
    await test.step('Verify first owner details on owners information page', async () => {
        await pm.onOwnersPage().clickOnOwnerName(expectedFirstOwnerFullName);
        await expect(page.locator('b.ownerFullName')).toHaveText(expectedFirstOwnerFullName);
        const adressTextLocator = page.locator('tr', { hasText: 'Address' }).getByRole('cell').last();
        await expect(adressTextLocator).toHaveText(owners[0].address);
        const cityTextLocator = page.locator('tr', { hasText: 'City' }).getByRole('cell').last();
        await expect(cityTextLocator).toHaveText(owners[0].city);
        const telephoneTextLocator = page.locator('tr', { hasText: 'Telephone' }).getByRole('cell').last();
        await expect(telephoneTextLocator).toHaveText(owners[0].telephone);
    });
    const petListItems = page.locator("app-pet-list")
    await test.step('Verify pets count and names on owners information page', async () => {
        await expect(petListItems).toHaveCount(owners[0].pets.length);
        await expect(petListItems.first()).toContainText(owners[0].pets[0].name);
        await expect(petListItems.nth(1)).toContainText(owners[0].pets[1].name);
    });
    await test.step('Verify visits count for first pet on owners information page', async () => {
        const expectedVisitCountsForFirstPet = owners[0].pets[0].visits.length + 1; // +1 for the header row
        await expect(petListItems.first().getByRole('table').last().getByRole('row')).toHaveCount(expectedVisitCountsForFirstPet);
    });
});

test('intercept api response', async ({ page }) => {
    await page.route('*/**/api/vets', async route => {
        const response = await route.fetch();
        const responseBody = await response.json();
        responseBody.find((vet: any) => vet.firstName === 'Sharon' && vet.lastName === 'Jenkins').specialties = tenSpecialties;
        await route.fulfill({
            body: JSON.stringify(responseBody),
        });
    });

    const pm = new PageManager(page);
    await pm.navigateTo().homePage();
    await pm.navigateTo().veterinariansPage();
    const sharonVetRow = page.getByRole('row', { name: 'Sharon Jenkins' });
    await expect(sharonVetRow.getByRole('cell').nth(1)).toHaveText(' ' + tenSpecialties.map(s => s.name).join('  ') + ' ');
});

test('Add and delete an owner', async ({ page, request }) => {
    const newOwnerFirstName = faker.person.firstName();
    const newOwnerLastName = faker.person.lastName();
    const newOwnerFullName = `${newOwnerFirstName} ${newOwnerLastName}`;
    const newOwnerAddress = faker.location.streetAddress();
    const newOwnerCity = faker.location.city();
    const newOwnerTelephone = faker.string.numeric(10)

    const pm = new PageManager(page);
    await pm.navigateTo().homePage();
    await pm.navigateTo().newOwnerPage();
    await pm.onAddNewOwnerPage().addNewOwner(newOwnerFirstName, newOwnerLastName, newOwnerAddress, newOwnerCity, newOwnerTelephone);

    const newOwnerResponse = await page.waitForResponse('*/**/api/owners');
    const newOwnerResponseBody = await newOwnerResponse.json();
    const newOwnerId = newOwnerResponseBody.id;

    await pm.navigateTo().ownersSearchPage();
    await pm.onOwnersPage().verifyOwnersTableRowsCount(11);
    await pm.onOwnersPage().verifyOwnerInTable(newOwnerFullName, newOwnerAddress, newOwnerCity, newOwnerTelephone);

    const deleteOwnerResponse = await request.delete(`https://petclinic-api.bondaracademy.com/petclinic/api/owners/${newOwnerId}`);
    expect(deleteOwnerResponse.status()).toEqual(204);
    await page.reload();
    await pm.onOwnersPage().verifyOwnersTableRowsCount(10);
    await pm.onOwnersPage().verifyOwnerIsNotVisible(newOwnerFullName);
});
