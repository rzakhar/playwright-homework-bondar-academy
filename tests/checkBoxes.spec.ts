import { test, expect, Page, Locator } from '@playwright/test';

test.describe('Checkboxes Tests', () => {
    test.beforeEach(async ({ page }) => {
        await test.step('Open the home page', async () => {
            await page.goto('/')
            await waitForOverlayToHide(page);
            await expect(page.locator('.title')).toHaveText('Welcome to Petclinic')
        });
        await test.step('Navigate to Veterinarians page', async () => {
            await page.getByRole('button', { name: 'Veterinarians' }).click();
            await page.getByRole('link', { name: 'All' }).click();
            await waitForOverlayToHide(page);
            await expect(page.getByRole('heading', { name: 'Veterinarians' })).toBeVisible();
        });
    })

    test('Validate selected specialties', async ({ page }) => {
        const name = "Helen Leary";
        var specialties = ['radiology'];

        await test.step(`Verify specialties for vet ${name}`, async () => {
            await goToEditVetPage(page, name);
            await openSpecialtiesDropdown(page);
            await verifySpecialtiesSelected(page, specialties);
        });

        await test.step('Modify specialties selection', async () => {
            specialties = await setSpeciality(page, specialties, 'surgery', true);
            specialties = await setSpeciality(page, specialties, 'radiology', false);
            await verifySpecialtiesSelected(page, specialties);
            specialties = await setSpeciality(page, specialties, 'dentistry', true);
            await verifySpecialtiesSelected(page, specialties);
        });
    });

    test('Select all specialties', async ({ page }) => {
        const name = "Rafael Ortega";
        var specialties = ['surgery'];

        await test.step(`Verify specialties for vet ${name}`, async () => {
            await goToEditVetPage(page, name);
            await openSpecialtiesDropdown(page);
            await verifySpecialtiesSelected(page, specialties);
        });

        await test.step('Select all specialties', async () => {
            const allSpecialties = ['surgery', 'dentistry', 'radiology'];
            for (const specialty of allSpecialties) {
                if (!specialties.includes(specialty)) {
                    specialties = await setSpeciality(page, specialties, specialty, true);
                }
            }
            await verifySpecialtiesSelected(page, specialties);
        });
    });

    test('Unselect all specialties', async ({ page }) => {
        const name = "Linda Douglas";
        var specialties = ['dentistry', 'surgery'];

        await test.step(`Verify specialties for vet ${name}`, async () => {
            await goToEditVetPage(page, name);
            await openSpecialtiesDropdown(page);
            await verifySpecialtiesSelected(page, specialties);
        });

        await test.step('Unselect all specialties', async () => {
            for (const specialty of specialties.slice()) {
                specialties = await setSpeciality(page, specialties, specialty, false);
            }
            await verifySpecialtiesSelected(page, specialties);
        });
    });

    async function goToEditVetPage(page: Page, name: string) {
        await page.getByRole('row').filter({ hasText: name }).getByRole('button', { name: 'Edit Vet' }).click();
        await waitForOverlayToHide(page);
        await verifyEditVetPageIsVisible(page);
    }

    async function verifyEditVetPageIsVisible(page: Page) {
        await expect(page.getByRole('heading', { name: 'Edit Veterinarian' })).toBeVisible();
    }

    async function verifySpecialtiesSelected(page: Page, specialties: string[]) {
        const specialtiesDropdown = page.locator('span.selected-specialties');

        await test.step('Verify selected specialties text', async () => {
            if (specialties.length != 0) {
                const specialtiesString = specialties.join(', ')
                await expect(specialtiesDropdown).toHaveText(specialtiesString);
            }
        });
        
        var unverifiedSpecialties = specialties;

        await test.step('Verify checkboxes states', async () => {
            const dropdownList = page.locator('div.dropdown-content').locator('div').filter({ has: page.getByRole('checkbox') });

            for(const dropdownItem of await dropdownList.all()) {
                const itemValue = await dropdownItem.textContent();
                expect(itemValue).not.toBeNull();
                if (itemValue && unverifiedSpecialties.includes(itemValue)) {
                    await expect(dropdownItem.getByRole('checkbox')).toBeChecked();
                    unverifiedSpecialties = unverifiedSpecialties.filter(s => s !== itemValue);
                } else if (itemValue) {
                    await expect(dropdownItem.getByRole('checkbox')).not.toBeChecked();
                }
            }
        });

        await test.step('Verify all specialties were verified', async () => { 
            expect(unverifiedSpecialties.length).toBe(0);
        });
    }

    async function setSpeciality(page: Page, specialties: string[], specialty: string, checked: boolean) {
        const specialtyItem = page.locator('div.dropdown-content').locator('div').filter({ hasText: specialty });
        var updatedSpecialties = specialties;
        const checkbox = specialtyItem.getByRole('checkbox');
        if (checked) {
            await checkbox.check();
            updatedSpecialties.push(specialty);
        } else {
            await checkbox.uncheck();
            updatedSpecialties = updatedSpecialties.filter(s => s !== specialty);
        }
        return updatedSpecialties;
    }

    async function openSpecialtiesDropdown(page: Page) {
        const specialtiesDropdown = page.locator('span.selected-specialties');
        await specialtiesDropdown.click();
        expect(page.locator('div.dropdown-content')).toBeVisible();
    }

    async function waitForOverlayToHide(page: Page) {
        const overlay = page.locator('.overlay');

        await test.step('Wait for overlay to hide', async () => {
            await overlay.waitFor({ state: 'visible', timeout: 1000 },).catch(() => { });
            await overlay.waitFor({ state: 'hidden', timeout: 10000 });
        });
    }
});
