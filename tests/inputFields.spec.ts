import { test, expect, Page, Locator } from '@playwright/test';

test.describe('Input Fields Tests', () => {
    test.beforeEach(async ({ page }) => {
        await test.step('Open the home page', async () => {
            await page.goto('/')
            await waitForOverlayToHide(page);
            await expect(page.locator('.title')).toHaveText('Welcome to Petclinic')
        });
        await test.step('Navigate to Pet types page', async () => {
            await page.getByRole('navigation').getByRole('link', { name: 'Pet types' }).click();
            await waitForOverlayToHide(page);
            await expect(page.getByRole('heading', { name: 'Pet Types' })).toBeVisible();
        });
    })

    test('Update pet type', async ({ page }) => {
        const initialName = "cat";
        const newName = "rabbit";
        const initialFirstCell = page.getByRole('cell', { name: initialName });
        const firstCell = page.getByRole('cell').filter({ has: page.locator('input') }).first();

        await test.step(`Edit pet type from "${initialName}" to "${newName}"`, async () => {
            await goToEditPetTypeForCell(page, initialFirstCell);
            await updatePetType(page, newName);
            await saveChanges(page);
            await verifyValueForCell(page, firstCell, newName);
        });
        await test.step(`Revert pet type from "${newName}" back to "${initialName}"`, async () => {
            await goToEditPetTypeForCell(page, firstCell);
            await updatePetType(page, initialName);
            await saveChanges(page);
            await verifyValueForCell(page, firstCell, initialName);
        });
    });

    test('Cancel pet type update', async ({ page }) => {
        const initialName = "dog";
        const newName = "moose";
        const initialCell = page.getByRole('cell', { name: initialName });

        await test.step(`Start editing pet type from "${initialName}" to "${newName} and cancel"`, async () => {
            await goToEditPetTypeForCell(page, initialCell);
            await updatePetType(page, newName);
            await cancelChanges(page);
            await verifyValueForCell(page, initialCell, initialName);
        });
    });

    test('Pet type name is required validation', async ({ page }) => {
        const initialName = "lizard";
        const emptyName = "";
        const initialCell = page.getByRole('cell', { name: initialName });

        await test.step(`Start editing pet type "${initialName}" and validate the form"`, async () => {
            await goToEditPetTypeForCell(page, initialCell);
            await updatePetType(page, emptyName);
            await verifyEmptyNewNameValidation(page);
            await saveChanges(page);
            await verifyEditPetTypePageIsVisible(page);
            await cancelChanges(page);
            await verifyValueForCell(page, initialCell, initialName);
        });
    });

    async function updatePetType(page: Page, newValue: string) {
        const petTypeInput = page.locator('#name');

        await test.step(`Update pet type to "${newValue}"`, async () => {
            await petTypeInput.clear();
            await petTypeInput.fill(newValue);
            await expect(petTypeInput).toHaveValue(newValue);
        });
    }

    async function saveChanges(page: Page) {
        const updateButton = page.getByRole('button', { name: 'Update' });

        await test.step(`Save changes`, async () => {
            await updateButton.click();
            await waitForOverlayToHide(page);
        });
    }

    async function verifyEmptyNewNameValidation(page: Page) {
        const nameIsRequiredMessage = page.getByText('Name is required');

        await test.step(`Verify empty name form validation`, async () => {
            await expect(nameIsRequiredMessage).toBeVisible();
        });
    }

    async function cancelChanges(page: Page) {
        const cancelButton = page.getByRole('button', { name: 'Cancel' });

        await test.step(`Cancel changes`, async () => {
            await cancelButton.click();
            await waitForOverlayToHide(page);
        });
    }

    async function verifyValueForCell(page: Page, cell: Locator, expectedValue: string) {
        await expect(cell.locator('input')).toHaveValue(expectedValue);
    }

    async function goToEditPetTypeForCell(page: Page, cell: Locator) {
        await page.getByRole('row').filter({ has: cell }).getByRole('button', { name: 'Edit' }).first().click();
        await waitForOverlayToHide(page);
        await verifyEditPetTypePageIsVisible(page);
    }

    async function verifyEditPetTypePageIsVisible(page: Page) {
        await expect(page.getByRole('heading', { name: 'Edit Pet Type' })).toBeVisible();
    }

    async function waitForOverlayToHide(page: Page) {
        const overlay = page.locator('.overlay');

        await test.step('Wait for overlay to hide', async () => {
            await overlay.waitFor({ state: 'visible', timeout: 1000 },).catch(() => { });
            await overlay.waitFor({ state: 'hidden', timeout: 5000 });
        });
    }
});
