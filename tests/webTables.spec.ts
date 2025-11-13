import { test, expect } from '@playwright/test';

test.describe('Web Tables Tests for Owners Page', () => {
    test.beforeEach(async ({ page }) => {
        await test.step('Open the home page', async () => {
            await page.goto('/')
            await expect(page.locator('.title')).toHaveText('Welcome to Petclinic')
        });
        await test.step('Navigate to Owners page', async () => {
            await page.getByRole('button', { name: 'Owners' }).click();
            await page.getByRole('link', { name: 'Search' }).click();
            await expect(page.getByRole('heading', { name: 'Owners' })).toBeVisible();
        });
    })

    test('Validate the pet name city of the owner', async ({ page }) => {
        const ownerRow = page.getByRole('row', { name: "Jeff Black" });
        await expect(ownerRow.getByRole('cell', { name: 'Monona' })).toBeVisible();
        await expect(ownerRow.getByRole('cell', { name: 'Lucky' })).toBeVisible();
    });

    test('Validate owners count of the Madison city', async ({ page }) => {
        const madisonCells = page.getByRole('cell', { name: 'Madison' });
        await expect(madisonCells).toHaveCount(4);
    });

    test('Validate search by Last Name', async ({ page }) => {
        await page.locator('input#lastName').fill('Black');
        await page.getByRole('button', { name: 'Find Owner' }).click();
        const ownerCells = page.locator('td.ownerFullName');
        await expect(ownerCells).toHaveCount(1);
        await expect(ownerCells.first()).toContainText('Black');

        await page.locator('input#lastName').fill('Davis');
        await page.getByRole('button', { name: 'Find Owner' }).click();
        await expect(ownerCells).toHaveCount(2);
        for (const ownerCell of await ownerCells.all()) {
            await expect(ownerCell).toContainText('Davis');
        }

        await page.locator('input#lastName').fill('Es');
        await page.getByRole('button', { name: 'Find Owner' }).click();
        await expect(ownerCells).toHaveCount(2);
        for (const ownerCell of await ownerCells.all()) {
            await expect(ownerCell).toContainText('Es');
        }

        await page.locator('input#lastName').fill('Playwright');
        await page.getByRole('button', { name: 'Find Owner' }).click();
        await expect(ownerCells).toHaveCount(0);
        await expect(page.locator('div').getByText('No owners with LastName starting with "Playwright"')).toBeVisible();
    });

    test('Validate phone number and pet name on the Owner Information page', async ({ page }) => {
        const phoneNumber = '6085552765';
        const ownerRow = page.getByRole('row', { name: phoneNumber });

        const pet = await ownerRow.getByRole('cell').last().textContent() || '';
        ownerRow.getByRole('link').click();

        const telephoneLabel = page.locator('th', { hasText: 'Telephone' });
        await expect(page.getByRole('row').filter({ has: telephoneLabel })).toContainText(phoneNumber);
        await expect(page.locator('dl.dl-horizontal dd').first()).toHaveText(pet);
    });

    test('Validate pets of the Madison city', async ({ page }) => {
        const madisonOwnerRows = page.getByRole('row').filter({ has: page.getByRole('cell', { name: 'Madison' }) });
        const expectedPets = [' Leo ', ' George ', ' Mulligan ', ' Freddy '];
        var actualPets = [];
        await expect(madisonOwnerRows).toHaveCount(expectedPets.length);

        for (let madisonOwnerRow of await madisonOwnerRows.all()) {
            const petName = await madisonOwnerRow.getByRole('cell').last().textContent() || '';
            actualPets.push(petName);
        }
        expect(actualPets).toEqual(expectedPets);
    });
});

test('Validate specialty update', async ({ page }) => {
    await test.step('Validate the current specialty', async () => {
        await page.goto('/')
        await expect(page.locator('.title')).toHaveText('Welcome to Petclinic')
        await page.getByRole('button', { name: 'Veterinarians' }).click();
        await page.getByRole('link', { name: 'All' }).click();
        await expect(page.getByRole('row', { name: 'Rafael Ortega' }).getByRole('cell', { name: 'surgery' })).toBeVisible();
    });
    await test.step('Update specialty name from dermatology to surgery', async () => {
        await page.getByRole('link', { name: 'Specialties' }).click();
        await expect(page.getByRole('heading', { name: 'Specialties' })).toBeVisible();
        await page.getByRole('row', { name: 'surgery' }).getByRole('button', { name: 'Edit' }).click();
        await expect(page.getByRole('heading', { name: 'Edit Specialty' })).toBeVisible();
        await expect(page.getByRole('textbox')).toHaveValue('surgery');
        await page.getByRole('textbox').fill('dermatology');
        await page.getByRole('button', { name: 'Update' }).click();
        await expect(page.getByRole('row', { name: 'dermatology' })).toBeVisible();
        await expect(page.getByRole('row', { name: 'surgery' })).not.toBeVisible();
    });
    await test.step('Validate the updated specialty', async () => {
        await page.getByRole('button', { name: 'Veterinarians' }).click();
        await page.getByRole('link', { name: 'All' }).click();
        await expect(page.getByRole('row', { name: 'Rafael Ortega' }).getByRole('cell', { name: 'dermatology' })).toBeVisible();
    });
    await test.step('Revert specialty name from surgery to dermatology', async () => {
        await page.getByRole('link', { name: 'Specialties' }).click();
        await expect(page.getByRole('heading', { name: 'Specialties' })).toBeVisible();
        await page.getByRole('row', { name: 'dermatology' }).getByRole('button', { name: 'Edit' }).click();
        await expect(page.getByRole('heading', { name: 'Edit Specialty' })).toBeVisible();
        await expect(page.getByRole('textbox')).toHaveValue('dermatology');
        await page.getByRole('textbox').fill('surgery');
        await page.getByRole('button', { name: 'Update' }).click();
        await expect(page.getByRole('row', { name: 'surgery' })).toBeVisible();
        await expect(page.getByRole('row', { name: 'dermatology' })).not.toBeVisible();
    });
})

test('Validate specialty lists', async ({ page }) => {
        await page.goto('/')
        await expect(page.locator('.title')).toHaveText('Welcome to Petclinic')
        await page.getByRole('link', { name: 'Specialties' }).click();
        await page.getByRole('button', { name: 'Add' }).click();
        await page.locator("input#name").fill('oncology');
        await page.getByRole('button', { name: 'Save' }).click();
        await expect(page.getByRole('row', { name: 'oncology' })).toBeVisible();

        var allSpecialties = [];
        const specialtyRows = page.getByRole('row').filter({ has: page.getByRole('textbox') });
        for (let specialtyRow of await specialtyRows.all()) {
            const specialtyName = await specialtyRow.getByRole('cell').getByRole('textbox').inputValue() || '';
            allSpecialties.push(specialtyName);
        };

        await page.getByRole('button', { name: 'Veterinarians' }).click();
        await page.getByRole('link', { name: 'All' }).click();
        await page.getByRole('row', { name: 'Sharon Jenkins' }).getByRole('button', { name: 'Edit Vet' }).click();
        await page.locator('div.dropdown').click();
        const allCheckboxes = page.getByRole('checkbox');
        var specialtiesDropdownItems = [];
        for (let checkBox of await allCheckboxes.all()) {
            specialtiesDropdownItems.push(await checkBox.getAttribute('id') || '');
        }
        await expect(specialtiesDropdownItems).toEqual(allSpecialties);
        await page.getByRole('checkbox', { name: 'oncology' }).check();
        await expect(page.locator('span.selected-specialties')).toHaveText('oncology');
        await page.locator('div.dropdown').click();
        await page.getByRole('button', { name: 'Save Vet' }).click();
        await expect(page.getByRole('row', { name: 'Sharon Jenkins' }).getByRole('cell', { name: 'oncology' })).toBeVisible();

        await page.getByRole('link', { name: 'Specialties' }).click();
        await page.getByRole('row', { name: 'oncology' }).getByRole('button', { name: 'Delete' }).click();
        await expect(page.getByRole('row', { name: 'oncology' })).not.toBeVisible();
})
