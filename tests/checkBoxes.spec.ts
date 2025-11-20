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
        await pm.onVeterinarsPage().selectByNameAndGoToEditByPressingEditButton("Helen Leary");
        await pm.onVeterinarsPage().verifySpecialtiesDropdownSummary(["radiology"]);
        await pm.onVeterinarsPage().verifySpecialtiesDropdownItems({ "radiology": true, "surgery": false, "dentistry": false });
        await pm.onVeterinarsPage().changeSpecialtySelection("surgery", true);
        await pm.onVeterinarsPage().changeSpecialtySelection("radiology", false);
        await pm.onVeterinarsPage().verifySpecialtiesDropdownSummary(["surgery"]);
        await pm.onVeterinarsPage().changeSpecialtySelection("dentistry", true);
        await pm.onVeterinarsPage().verifySpecialtiesDropdownSummary(["surgery", "dentistry"]);
    });

    test('Select all specialties', async ({ page }) => {
        const pm = new PageManager(page);
        await pm.onVeterinarsPage().selectByNameAndGoToEditByPressingEditButton("Rafael Ortega");
        await pm.onVeterinarsPage().verifySpecialtiesDropdownSummary(["surgery"]);
        await pm.onVeterinarsPage().verifySpecialtiesDropdownItems({ "surgery": true, "radiology": false, "dentistry": false });
        await pm.onVeterinarsPage().modifyAllSpecialtiesCheckboxesToOneState(true);
        await pm.onVeterinarsPage().verifySpecialtiesDropdownSummary(["surgery", "radiology", "dentistry"]);
    });

    test('Unselect all specialties', async ({ page }) => {
        const pm = new PageManager(page);
        await pm.onVeterinarsPage().selectByNameAndGoToEditByPressingEditButton("Linda Douglas");
        await pm.onVeterinarsPage().verifySpecialtiesDropdownSummary(["dentistry", "surgery"]);
        await pm.onVeterinarsPage().verifySpecialtiesDropdownItems({ "surgery": true, "radiology": false, "dentistry": true });
        await pm.onVeterinarsPage().modifyAllSpecialtiesCheckboxesToOneState(false);
        await pm.onVeterinarsPage().verifySpecialtiesDropdownSummary([]);
    });
});
