import { test } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';

test.describe('Checkboxes Tests', () => {
    test.beforeEach(async ({ page }) => {
        const pm = new PageManager(page);
        await pm.navigateTo().homePage();
        await pm.navigateTo().veterinariansPage();
    });

    test('Validate selected specialties', async ({ page }) => {
        const pm = new PageManager(page);
        await pm.onVeterinariansPage().clickEditButtonFor("Helen Leary");
        await pm.onEditVeterinarianPage().verifySpecialtiesDropdownSummary(["radiology"]);
        await pm.onEditVeterinarianPage().verifySpecialtiesDropdownItems({ "radiology": true, "surgery": false, "dentistry": false });
        await pm.onEditVeterinarianPage().changeSpecialtySelection("surgery", true);
        await pm.onEditVeterinarianPage().changeSpecialtySelection("radiology", false);
        await pm.onEditVeterinarianPage().verifySpecialtiesDropdownSummary(["surgery"]);
        await pm.onEditVeterinarianPage().changeSpecialtySelection("dentistry", true);
        await pm.onEditVeterinarianPage().verifySpecialtiesDropdownSummary(["surgery", "dentistry"]);
    });

    test('Select all specialties', async ({ page }) => {
        const pm = new PageManager(page);
        await pm.onVeterinariansPage().clickEditButtonFor("Rafael Ortega");
        await pm.onEditVeterinarianPage().verifySpecialtiesDropdownSummary(["surgery"]);
        await pm.onEditVeterinarianPage().verifySpecialtiesDropdownItems({ "surgery": true, "radiology": false, "dentistry": false });
        await pm.onEditVeterinarianPage().selectAllSpecialties(true);
        await pm.onEditVeterinarianPage().verifySpecialtiesDropdownSummary(["surgery", "radiology", "dentistry"]);
    });

    test('Unselect all specialties', async ({ page }) => {
        const pm = new PageManager(page);
        await pm.onVeterinariansPage().clickEditButtonFor("Linda Douglas");
        await pm.onEditVeterinarianPage().verifySpecialtiesDropdownSummary(["dentistry", "surgery"]);
        await pm.onEditVeterinarianPage().verifySpecialtiesDropdownItems({ "surgery": true, "radiology": false, "dentistry": true });
        await pm.onEditVeterinarianPage().selectAllSpecialties(false);
        await pm.onEditVeterinarianPage().verifySpecialtiesDropdownSummary([]);
    });
});
