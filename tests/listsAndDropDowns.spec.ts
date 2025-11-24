import { test } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';

test.describe('Lists and dropdown Tests', () => {
    test.beforeEach(async ({ page }) => {
        const pm = new PageManager(page);
        await pm.navigateTo().homePage();
        await pm.navigateTo().ownersSearchPage();
    })

    test('Validate selected pet types from the list', async ({ page }) => {
        const pm = new PageManager(page);
        await pm.onOwnersPage().clickOnOwnerName("George Franklin");
        await pm.onOwnerInformationPage().goToPetDetailsPageByClickingOnEditPetButton("Leo");
        await pm.onPetDetailsPage().verifyPetNameOwnerAndType("Leo", "George Franklin", "cat");
        await pm.onPetDetailsPage().selectEveryPetTypeAndVerifySelectionWithoutSaving();
    });

    test('Validate the pet type update', async ({ page }) => {
        const pm = new PageManager(page);
        await pm.onOwnersPage().clickOnOwnerName("Eduardo Rodriquez");

        await test.step(`Change Rosy pet type from dog to bird`, async () => {
            await pm.onOwnerInformationPage().goToPetDetailsPageByClickingOnEditPetButton("Rosy");
            await pm.onPetDetailsPage().verifyPetNameOwnerAndType("Rosy", "Eduardo Rodriquez", "dog");
            await pm.onPetDetailsPage().updatePetTypeAndVerifyOnPetList("Rosy", "bird");
        });

        await test.step(`Revert Rosy pet type back from bird to dog`, async () => {
            await pm.onOwnerInformationPage().goToPetDetailsPageByClickingOnEditPetButton("Rosy");
            await pm.onPetDetailsPage().verifyPetNameOwnerAndType("Rosy", "Eduardo Rodriquez", "bird");
            await pm.onPetDetailsPage().updatePetTypeAndVerifyOnPetList("Rosy", "dog");
        });
    });
});
