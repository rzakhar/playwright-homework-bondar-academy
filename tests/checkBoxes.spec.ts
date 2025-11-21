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
        await pm.onVeterinariansPage().selectByNameAndGoToEditByPressingEditButton("Helen Leary");
        await pm.onVeterinariansPage().verifySpecialtiesDropdownSummary(["radiology"]);
        await pm.onVeterinariansPage().verifySpecialtiesDropdownItems({ "radiology": true, "surgery": false, "dentistry": false });
        await pm.onVeterinariansPage().changeSpecialtySelection("surgery", true);
        await pm.onVeterinariansPage().changeSpecialtySelection("radiology", false);
        await pm.onVeterinariansPage().verifySpecialtiesDropdownSummary(["surgery"]);
        await pm.onVeterinariansPage().changeSpecialtySelection("dentistry", true);
        await pm.onVeterinariansPage().verifySpecialtiesDropdownSummary(["surgery", "dentistry"]);
    });

    test('Select all specialties', async ({ page }) => {
        const pm = new PageManager(page);
        await pm.onVeterinariansPage().selectByNameAndGoToEditByPressingEditButton("Rafael Ortega");
        await pm.onVeterinariansPage().verifySpecialtiesDropdownSummary(["surgery"]);
        await pm.onVeterinariansPage().verifySpecialtiesDropdownItems({ "surgery": true, "radiology": false, "dentistry": false });
        await pm.onVeterinariansPage().modifyAllSpecialtiesCheckboxesToOneState(true);
        await pm.onVeterinariansPage().verifySpecialtiesDropdownSummary(["surgery", "radiology", "dentistry"]);
    });

    test('Unselect all specialties', async ({ page }) => {
        const pm = new PageManager(page);
        await pm.onVeterinariansPage().selectByNameAndGoToEditByPressingEditButton("Linda Douglas");
        await pm.onVeterinariansPage().verifySpecialtiesDropdownSummary(["dentistry", "surgery"]);
        await pm.onVeterinariansPage().verifySpecialtiesDropdownItems({ "surgery": true, "radiology": false, "dentistry": true });
        await pm.onVeterinariansPage().modifyAllSpecialtiesCheckboxesToOneState(false);
        await pm.onVeterinariansPage().verifySpecialtiesDropdownSummary([]);
    });
});
