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
        await expect(page.locator("div.col-sm-10", { has: petNameTextBox }).locator('span')).toHaveClass("glyphicon form-control-feedback glyphicon-ok");

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

        const petTable = page.locator('dl.dl-horizontal');
        const petDefinitions = petTable.getByRole('definition');
        await expect(petDefinitions.first()).toHaveText('Tom');
        await expect(petDefinitions.nth(1)).toHaveText(`${year}-${month}-${day}`);
        await expect(petDefinitions.nth(2)).toHaveText('dog');

        await page.getByRole('button', { name: 'Delete Pet' }).click();
        await expect(petTable).toBeHidden();
    });

    test(" Select the dates of visits and validate dates order", async ({ page }) => {
        await page.getByRole('link', { name: "Jean Coleman" }).click();
        await page.locator('app-pet-list').filter({ hasText: "Samantha" }).getByRole('button', { name: 'Add Visit' }).click();
        await expect(page.getByRole('heading', { name: 'New Visit' })).toBeVisible();

        const petRow = page.getByRole('row', { name: 'Samantha' });
        await expect(petRow.getByRole('cell').first()).toHaveText('Samantha');
        await expect(petRow.getByRole('cell').last()).toHaveText('Jean Coleman');

        const firstNewVisitDate = new Date();
        const firstNewVisitYear = firstNewVisitDate.getFullYear();
        const firstNewVisitMonth = String(firstNewVisitDate.getMonth() + 1).padStart(2, '0');
        const firstNewVisitDay = String(firstNewVisitDate.getDate()).padStart(2, '0');
        const expectedFirstNewVisitDateInputValue = `${firstNewVisitYear}/${firstNewVisitMonth}/${firstNewVisitDay}`;

        await page.getByRole('button', { name: 'Open Calendar' }).click();
        await page.getByRole('button', { name: expectedFirstNewVisitDateInputValue }).click();
        await expect(page.locator('input[name="date"]')).toHaveValue(expectedFirstNewVisitDateInputValue);
        await page.locator('input[name="description"]').fill('dermatologists visit');
        await page.getByRole('button', { name: 'Add Visit' }).click();

        const samanthaVisitsTable = page.locator('app-pet-list').filter({ hasText: "Samantha" }).locator('app-visit-list');
        await expect(samanthaVisitsTable.getByRole('row').nth(1).getByRole('cell').first()).toHaveText(`${firstNewVisitYear}-${firstNewVisitMonth}-${firstNewVisitDay}`);

        await page.locator('app-pet-list').filter({ hasText: "Samantha" }).getByRole('button', { name: 'Add Visit' }).click();

        var secondNewVisitDate = new Date();
        secondNewVisitDate.setDate(secondNewVisitDate.getDate() - 45);
        const secondNewVisitYear = secondNewVisitDate.getFullYear();
        const secondNewVisitMonth = String(secondNewVisitDate.getMonth() + 1).padStart(2, '0');
        const secondNewVisitDay = String(secondNewVisitDate.getDate()).padStart(2, '0');
        const expectedSecondNewVisitDateInputValue = `${secondNewVisitYear}/${secondNewVisitMonth}/${secondNewVisitDay}`;

        await page.getByRole('button', { name: 'Open Calendar' }).click();
        await page.getByRole('button', { name: 'Previous month' }).click();
        const fullMonthsDifference = (firstNewVisitDate.getFullYear() - secondNewVisitDate.getFullYear()) * 12
            + (firstNewVisitDate.getMonth() - secondNewVisitDate.getMonth()) - 1;
        for (let i = 0; i < fullMonthsDifference; i++) {
            await page.getByRole('button', { name: 'Previous month' }).click();
        }
        await page.getByRole('button', { name: expectedSecondNewVisitDateInputValue }).click();
        await expect(page.locator('input[name="date"]')).toHaveValue(expectedSecondNewVisitDateInputValue);
        await page.locator('input[name="description"]').fill('massage therapy');
        await page.getByRole('button', { name: 'Add Visit' }).click();

        await expect(samanthaVisitsTable.getByRole('row').nth(1).getByRole('cell').first()).toHaveText(`${firstNewVisitYear}-${firstNewVisitMonth}-${firstNewVisitDay}`);
        await expect(samanthaVisitsTable.getByRole('row').nth(2).getByRole('cell').first()).toHaveText(`${secondNewVisitYear}-${secondNewVisitMonth}-${secondNewVisitDay}`);
        const thirdLatestVisitString = await samanthaVisitsTable.getByRole('row').nth(3).getByRole('cell').first().textContent()!;
        const fourthLatestVisitString = await samanthaVisitsTable.getByRole('row').nth(4).getByRole('cell').first().textContent()!;
        const thirdLatestVisitDate = new Date(thirdLatestVisitString!);
        const fourthLatestVisitDate = new Date(fourthLatestVisitString!);
        expect(thirdLatestVisitDate.getTime()).toBeLessThan(secondNewVisitDate.getTime());
        expect(fourthLatestVisitDate.getTime()).toBeLessThan(firstNewVisitDate.getTime());

        await samanthaVisitsTable.getByRole('row', { name: "dermatologists visit" }).getByRole('button', { name: 'Delete Visit' }).click();
        await samanthaVisitsTable.getByRole('row', { name: "massage therapy" }).getByRole('button', { name: 'Delete Visit' }).click();

        await expect(samanthaVisitsTable.getByRole('row', { name: "dermatologists visit" })).toBeHidden();
        await expect(samanthaVisitsTable.getByRole('row', { name: "massage therapy" })).toBeHidden();
    });
});
