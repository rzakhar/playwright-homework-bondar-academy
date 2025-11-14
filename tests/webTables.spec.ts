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
        await expect(ownerRow.getByRole('cell').nth(2)).toHaveText('Monona');
        await expect(ownerRow.getByRole('cell').last()).toHaveText('Lucky');
    });

    test('Validate owners count of the Madison city', async ({ page }) => {
        const madisonCells = page.getByRole('cell', { name: 'Madison' });
        await expect(madisonCells).toHaveCount(4);
    });

    test('Validate search by Last Name', async ({ page }) => {
        const searchInputsAndExpectedCounts = {
            "Black": 1,
            "Davis": 2,
            "Es": 2,
            "Playwright": 0
        };
        for (const [lastName, expectedCount] of Object.entries(searchInputsAndExpectedCounts)) {
            await page.locator('input#lastName').fill(lastName);
            await page.getByRole('button', { name: 'Find Owner' }).click();
            const ownerFullNameCells = page.locator('td.ownerFullName');
            await expect(ownerFullNameCells).toHaveCount(expectedCount);
            if (expectedCount > 0) {
                for (const ownerCell of await ownerFullNameCells.all()) {
                    await expect(ownerCell).toContainText(lastName);
                }
            } else {
                await expect(page.locator('div').getByText(`No owners with LastName starting with "${lastName}"`)).toBeVisible();
            }
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
    await test.step('Validate the current specialty', async () => {
        await page.goto('/')
        await expect(page.locator('.title')).toHaveText('Welcome to Petclinic')
        await page.getByRole('button', { name: 'Veterinarians' }).click();
        await page.getByRole('link', { name: 'All' }).click();
        await expect(page.getByRole('row', { name: 'Rafael Ortega' }).getByRole('cell').nth(1)).toHaveText('surgery');
    });
    await test.step('Update specialty name from dermatology to surgery', async () => {
        await page.getByRole('link', { name: 'Specialties' }).click();
        await expect(page.getByRole('heading', { name: 'Specialties' })).toBeVisible();
        await page.getByRole('row', { name: 'surgery' }).getByRole('button', { name: 'Edit' }).click();
        await expect(page.getByRole('heading', { name: 'Edit Specialty' })).toBeVisible();
        await expect(page.getByRole('textbox')).toHaveValue('surgery');
        await page.getByRole('textbox').fill('dermatology');
        await page.getByRole('button', { name: 'Update' }).click();
        await expect(page.locator('input[id="1"]')).toHaveValue('dermatology');
    });
    await test.step('Validate the updated specialty', async () => {
        await page.getByRole('button', { name: 'Veterinarians' }).click();
        await page.getByRole('link', { name: 'All' }).click();
        await expect(page.getByRole('row', { name: 'Rafael Ortega' }).getByRole('cell').nth(1)).toHaveText('dermatology');
    });
    await test.step('Revert specialty name from surgery to dermatology', async () => {
        await page.getByRole('link', { name: 'Specialties' }).click();
        await expect(page.getByRole('heading', { name: 'Specialties' })).toBeVisible();
        await page.getByRole('row', { name: 'dermatology' }).getByRole('button', { name: 'Edit' }).click();
        await expect(page.getByRole('heading', { name: 'Edit Specialty' })).toBeVisible();
        await expect(page.getByRole('textbox')).toHaveValue('dermatology');
        await page.getByRole('textbox').fill('surgery');
        await page.getByRole('button', { name: 'Update' }).click();
        await expect(page.locator('input[id="1"]')).toHaveValue('surgery');
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
        const specialtyName = await specialtyRow.getByRole('cell').getByRole('textbox').inputValue()!;
        allSpecialties.push(specialtyName);
    };

    await page.getByRole('button', { name: 'Veterinarians' }).click();
    await page.getByRole('link', { name: 'All' }).click();
    await page.getByRole('row', { name: 'Sharon Jenkins' }).getByRole('button', { name: 'Edit Vet' }).click();
    await page.locator('div.dropdown').click();
    const allDropdownLabels = page.locator('div.dropdown-content label');
    var specialtiesDropdownItems = [];
    for (let dropdownLabel  of await allDropdownLabels.all()) {
        specialtiesDropdownItems.push(await dropdownLabel.textContent()!);
    }
    expect(specialtiesDropdownItems).toEqual(allSpecialties);
    await page.getByRole('checkbox', { name: 'oncology' }).check();
    await expect(page.locator('span.selected-specialties')).toHaveText('oncology');
    await page.locator('div.dropdown').click();
    await page.getByRole('button', { name: 'Save Vet' }).click();
    await expect(page.getByRole('row', { name: 'Sharon Jenkins' }).getByRole('cell').nth(1)).toHaveText('oncology');

    await page.getByRole('link', { name: 'Specialties' }).click();
    await page.getByRole('row', { name: 'oncology' }).getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByRole('row', { name: 'oncology' })).not.toBeVisible();
    await page.getByRole('button', { name: 'Veterinarians' }).click();
    await page.getByRole('link', { name: 'All' }).click();
    await expect(page.getByRole('row', { name: 'Sharon Jenkins' }).getByRole('cell').nth(1)).toHaveText('');
})
