import { test, expect } from '@playwright/test';

test('Add and delete pet type', async ({ page }) => {
    await test.step('Navigate to Pet Types page', async () => {
        await page.goto('/')
        await expect(page.locator('.title')).toHaveText('Welcome to Petclinic')
        await page.getByRole('link', { name: 'Pet Types' }).click();
        await expect(page.getByRole('heading', { name: 'Pet Types' })).toBeVisible();
    });
    const lastTableTextBox = page.getByRole("table").getByRole('textbox').last();
    await test.step('Add new pet type', async () => {
        await page.getByRole('button', { name: 'Add' }).click();
        await expect(page.getByRole('heading', { name: 'New Pet Type' })).toBeVisible();
        await expect(page.locator('label', { hasText: 'Name' })).toBeVisible();
        await expect(page.locator('input#name')).toBeVisible();
        await page.locator('input#name').fill('pig');
        await page.getByRole('button', { name: 'Save' }).click();
        await expect(lastTableTextBox).toHaveValue('pig');
    });
    await test.step('Delete the added pet type', async () => {
        page.on('dialog', async dialog => {
            expect(dialog.message()).toContain('Delete the pet type?');
            await dialog.accept();
        });
        await page.getByRole('button', { name: 'Delete' }).last().click();
        await expect(lastTableTextBox).not.toHaveValue('pig');
    });
})
