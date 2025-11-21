import { test, expect } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';

test.describe('Web Tables Tests for Owners Page', () => {
    test.beforeEach(async ({ page }) => {
        const pm = new PageManager(page);
        await pm.navigateTo().homePage();
        await pm.navigateTo().ownersSearchPage();
    })

    test('Validate the pet name city of the owner', async ({ page }) => {
        const ownerRow = page.getByRole('row', { name: "Jeff Black" });
        await expect(ownerRow.getByRole('cell').nth(2)).toHaveText('Monona');
        await expect(ownerRow.getByRole('cell').last()).toHaveText('Lucky');
    });

    test('Validate owners count of the Madison city', async ({ page }) => {
        const madisonCells = page.getByRole('cell', { name: 'Madison' });
        await expect(madisonCells).toHaveCount(4);
    });

    test('Validate search by Last Name', async ({ page }) => {
        const pm = new PageManager(page);
        for (const lastName of [
            "Black",
            "Davis",
            "Es",
            "Playwright"
        ]) {
            await pm.onOwnersPage().searchOwnerByLastName(lastName, lastName !== "Playwright");
        }
    });

    test('Validate phone number and pet name on the Owner Information page', async ({ page }) => {
        const phoneNumber = '6085552765';
        const ownerRow = page.getByRole('row', { name: phoneNumber });

        const petName = await ownerRow.getByRole('cell').last().textContent()!;
        await ownerRow.getByRole('link').click();

        await expect(page.getByRole('row', { name: 'Telephone' }).getByRole('cell').last()).toHaveText(phoneNumber);
        await expect(page.locator('dl.dl-horizontal dd').first()).toHaveText(petName!);
    });

    test('Validate pets of the Madison city', async ({ page }) => {
        const madisonOwnerRows = page.getByRole('row', { name: 'Madison' });
        const expectedPets = [' Leo ', ' George ', ' Mulligan ', ' Freddy '];
        var actualPets = [];
        await expect(madisonOwnerRows).toHaveCount(expectedPets.length);

        for (let madisonOwnerRow of await madisonOwnerRows.all()) {
            const petName = await madisonOwnerRow.getByRole('cell').last().textContent()!;
            actualPets.push(petName);
        }
        expect(actualPets).toEqual(expectedPets);
    });
});

test('Validate specialty update', async ({ page }) => {
    const pm = new PageManager(page)
    await test.step('Validate the current specialty', async () => {
        await pm.navigateTo().homePage();
        await pm.navigateTo().veterinariansPage();
        await expect(page.getByRole('row', { name: 'Rafael Ortega' }).getByRole('cell').nth(1)).toHaveText('surgery');
    });
    await pm.navigateTo().specialtiesPage();
    await pm.onSpecialtiesPage().renameSpecialtyAndVerifySpecialtiesTableUpdate('surgery', 'dermatology');
    await test.step('Validate the updated specialty', async () => {
        await pm.navigateTo().veterinariansPage();
        await expect(page.getByRole('row', { name: 'Rafael Ortega' }).getByRole('cell').nth(1)).toHaveText('dermatology');
    });
    await pm.navigateTo().specialtiesPage();
    await pm.onSpecialtiesPage().renameSpecialtyAndVerifySpecialtiesTableUpdate('dermatology', 'surgery');
});

test('Validate specialty lists', async ({ page }) => {
    const pm = new PageManager(page);
    await pm.navigateTo().homePage();
    await pm.navigateTo().specialtiesPage();
    await pm.onSpecialtiesPage().addSpecialtyAndVerifySpecialtiesTableUpdate('oncology');

    const allSpecialties = await pm.onSpecialtiesPage().getAllSpecialties();

    await pm.navigateTo().veterinariansPage();
    await pm.onVeterinariansPage().selectByNameAndGoToEditByPressingEditButton("Sharon Jenkins");

    const specialtiesDropdownItems = await pm.onVeterinariansPage().getAllSpecialtiesFromDropdown();
    expect(specialtiesDropdownItems).toEqual(allSpecialties);

    await pm.onVeterinariansPage().changeSpecialtySelection('oncology', true);
    await pm.onVeterinariansPage().verifySpecialtiesDropdownSummary(['oncology']);
    await page.locator('div.dropdown').click();
    await page.getByRole('button', { name: 'Save Vet' }).click();
    await expect(page.getByRole('row', { name: 'Sharon Jenkins' }).getByRole('cell').nth(1)).toHaveText('oncology');

    await pm.navigateTo().specialtiesPage();
    await pm.onSpecialtiesPage().deleteSpecialtyAndVerifySpecialtiesTableUpdate('oncology');
    await pm.navigateTo().veterinariansPage();
    await expect(page.getByRole('row', { name: 'Sharon Jenkins' }).getByRole('cell').nth(1)).toBeEmpty();
});
