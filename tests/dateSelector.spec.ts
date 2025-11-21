import { test, expect } from '@playwright/test';

test.describe('Date Selectors Tests', () => {
    test.beforeEach(async ({ page }) => {
        await test.step('Open the home page', async () => {
            await page.goto('/')
            await expect(page.locator('.title')).toHaveText('Welcome to Petclinic')
        });
        await test.step('Navigate to Owners Search page', async () => {
            await page.getByRole('button', { name: 'Owners' }).click();
            await page.getByRole('link', { name: 'Search' }).click();
            await expect(page.getByRole('heading', { name: 'Owners' })).toBeVisible();
        });
    })

    test("Select the desired date in the calendar widget", async ({ page }) => {
        await page.getByRole('link', { name: "Harold Davis" }).click();
        await page.getByRole('button', { name: 'Add New Pet' }).click();
        const petNameTextBox = page.getByRole('textbox', { name: 'Name' });
        await petNameTextBox.fill('Tom');
        await expect(page.locator("div.col-sm-10", { has: petNameTextBox }).locator('span')).toHaveClass(/glyphicon-ok/);

        const petBirthDate = new Date(2014, 4, 20);
        const year = petBirthDate.getFullYear();
        const month = String(petBirthDate.getMonth() + 1).padStart(2, '0');
        const day = String(petBirthDate.getDate()).padStart(2, '0');
        const expectedBirthDateInputValue = `${year}/${month}/${day}`;

        await page.getByRole('button', { name: 'Open Calendar' }).click();
        await page.getByRole('button', { name: 'Choose month and year' }).click();
        await page.getByRole('button', { name: 'Previous 24 years' }).click();
        await page.getByRole('button', { name: year.toString() }).click();
        await page.getByRole('button', { name: `${month} ${year}` }).click();
        await page.getByRole('button', { name: expectedBirthDateInputValue }).click();
        await expect(page.locator('input[name="birthDate"]')).toHaveValue(expectedBirthDateInputValue);

        await page.getByRole('combobox', { name: 'Type' }).selectOption('dog');
        await page.getByRole('button', { name: 'Save Pet' }).click();

        const tomPetSummarySection = page.locator('dl.dl-horizontal', { hasText: 'Tom' });
        const petSummaryRows = tomPetSummarySection.getByRole('definition');
        await expect(petSummaryRows.first()).toHaveText('Tom');
        await expect(petSummaryRows.nth(1)).toHaveText(`${year}-${month}-${day}`);
        await expect(petSummaryRows.nth(2)).toHaveText('dog');

        await page.getByRole('button', { name: 'Delete Pet' }).click();
        await expect(tomPetSummarySection).toBeHidden();
    });

    test("Select the dates of visits and validate dates order", async ({ page }) => {
        await page.getByRole('link', { name: "Jean Coleman" }).click();
        const samanthaPetSummaryAndVisitsSection = page.locator('app-pet-list').filter({ hasText: "Samantha" });
        await samanthaPetSummaryAndVisitsSection.getByRole('button', { name: 'Add Visit' }).click();
        await expect(page.getByRole('heading', { name: 'New Visit' })).toBeVisible();

        const petRow = page.getByRole('row', { name: 'Samantha' });
        await expect(petRow.getByRole('cell').first()).toHaveText('Samantha');
        await expect(petRow.getByRole('cell').last()).toHaveText('Jean Coleman');

        const currentDate = new Date();
        const currentDateVisitsTableExpectedValue = currentDate.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
        const currentDateInputFieldExpectedValue = currentDateVisitsTableExpectedValue.replace(/\//g, "-");

        await page.getByRole('button', { name: 'Open Calendar' }).click();
        await page.getByRole('button', { name: currentDateVisitsTableExpectedValue }).click();
        await expect(page.locator('input[name="date"]')).toHaveValue(currentDateVisitsTableExpectedValue);
        await page.locator('input[name="description"]').fill('dermatologists visit');
        await page.getByRole('button', { name: 'Add Visit' }).click();

        const samanthaVisitsTable = page.locator('app-pet-list', { hasText: "Samantha" }).locator('app-visit-list');
        await expect(samanthaVisitsTable.getByRole('row').nth(1).getByRole('cell').first()).toHaveText(currentDateInputFieldExpectedValue);

        await page.locator('app-pet-list').filter({ hasText: "Samantha" }).getByRole('button', { name: 'Add Visit' }).click();

        var fortyFiveDaysAgo = new Date()
        fortyFiveDaysAgo.setDate(currentDate.getDate() - 45);
        const fortyFiveDaysAgoVisitsTableExpectedValue = fortyFiveDaysAgo.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
        const fortyFiveDaysAgoInputFieldExpectedValue = fortyFiveDaysAgoVisitsTableExpectedValue.replace(/\//g, "-");

        await page.getByRole('button', { name: 'Open Calendar' }).click();

        const fortyFiveDaysAgoButton = page.getByRole('button', { name: fortyFiveDaysAgoVisitsTableExpectedValue });
        while (!await fortyFiveDaysAgoButton.isVisible()) {
            await page.getByRole('button', { name: 'Previous month' }).click();
        }
        await fortyFiveDaysAgoButton.click();
        await expect(page.locator('input[name="date"]')).toHaveValue(fortyFiveDaysAgoVisitsTableExpectedValue);
        await page.locator('input[name="description"]').fill('massage therapy');
        await page.getByRole('button', { name: 'Add Visit' }).click();

        await expect(samanthaVisitsTable.getByRole('row').nth(1).getByRole('cell').first()).toHaveText(currentDateInputFieldExpectedValue);
        await expect(samanthaVisitsTable.getByRole('row').nth(2).getByRole('cell').first()).toHaveText(fortyFiveDaysAgoInputFieldExpectedValue);

        await samanthaVisitsTable.getByRole('row', { name: "dermatologists visit" }).getByRole('button', { name: 'Delete Visit' }).click();
        await samanthaVisitsTable.getByRole('row', { name: "massage therapy" }).getByRole('button', { name: 'Delete Visit' }).click();

        await expect(samanthaVisitsTable.getByRole('row', { name: "dermatologists visit" })).toBeHidden();
        await expect(samanthaVisitsTable.getByRole('row', { name: "massage therapy" })).toBeHidden();
    });
});
