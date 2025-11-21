import { test, expect } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';

test('Delete specialty validation', async ({ page, request }) => {
    const token = process.env.ACCESS_TOKEN;

    const addSpecialtyResponse = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/specialties', {
        data: {
            "name": "api testing expert"
        },
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    expect(addSpecialtyResponse.status()).toEqual(201);

    const pm = new PageManager(page);
    await pm.navigateTo().homePage();
    await pm.navigateTo().specialtiesPage();
    await expect(page.getByRole('row', { name: "api testing expert" })).toBeVisible();
    await pm.onSpecialtiesPage().deleteSpecialtyAndVerifySpecialtiesTableUpdate('api testing expert');
});

test('Add and delete veterinarian', async ({ page, request }) => {
    const token = process.env.ACCESS_TOKEN;

    const addVetResponse = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/vets', {
        data: {
            "firstName": "Robot",
            "lastName": "Tester",
            id: null,
            "specialties": []
        },
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    expect(addVetResponse.status()).toEqual(201);
    const newVetId = (await addVetResponse.json()).id;

    const pm = new PageManager(page);
    await pm.navigateTo().homePage();
    await pm.navigateTo().veterinariansPage();
    const newVetRow = page.getByRole('row', { name: 'Robot Tester' });
    await expect(newVetRow).toBeVisible();
    await expect(newVetRow.getByRole('cell').nth(1)).toBeEmpty();
    await pm.onVeterinariansPage().selectByNameAndGoToEditByPressingEditButton("Robot Tester");
    await pm.onVeterinariansPage().verifySpecialtiesDropdownItems({ "radiology": false, "surgery": false, "dentistry": false });
    await pm.onVeterinariansPage().changeSpecialtySelection("dentistry", true);
    await page.locator('div.dropdown').click();
    await page.getByRole('button', { name: 'Save Vet' }).click();
    await expect(newVetRow.getByRole('cell').nth(1)).toHaveText('dentistry');

    const deleteVetResponse = await request.delete(`https://petclinic-api.bondaracademy.com/petclinic/api/vets/${newVetId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    expect(deleteVetResponse.status()).toEqual(204);

    const vetsListResponse = await request.get('https://petclinic-api.bondaracademy.com/petclinic/api/vets', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    expect(vetsListResponse.status()).toEqual(200);
    const vets = await vetsListResponse.json();
    const vetExists = vets.some((vet: { id: number; }) => vet.id === newVetId);
    expect(vetExists).toBeFalsy();
});

test('New specialty is displayed', async ({ page, request }) => {
    const token = process.env.ACCESS_TOKEN;
    const addSpecialtyResponse = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/specialties', {
        data: {
            "name": "api testing ninja"
        },
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    expect(addSpecialtyResponse.status()).toEqual(201);
    const newSpecialtyId = (await addSpecialtyResponse.json()).id;

    const addVetResponse = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/vets', {
        data: {
            "firstName": "Robot",
            "lastName": "Tester",
            id: null,
            "specialties":
                [{ id: 4330, name: "surgery" }]
        },
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    console.log(await addVetResponse.text());
    expect(addVetResponse.status()).toEqual(201);
    const newVetId = (await addVetResponse.json()).id;

    const pm = new PageManager(page);
    await pm.navigateTo().homePage();
    await pm.navigateTo().veterinariansPage();
    const newVetRow = page.getByRole('row', { name: 'Robot Tester' });
    await expect(newVetRow).toBeVisible();
    await expect(newVetRow.getByRole('cell').nth(1)).toHaveText('surgery');
    await pm.onVeterinariansPage().selectByNameAndGoToEditByPressingEditButton("Robot Tester");
    await pm.onVeterinariansPage().verifySpecialtiesDropdownItems({ "radiology": false, "surgery": true, "dentistry": false, "api testing ninja": false });
    await pm.onVeterinariansPage().changeSpecialtySelection("api testing ninja", true);
    await pm.onVeterinariansPage().changeSpecialtySelection("surgery", false);
    await page.locator('div.dropdown').click();
    await page.getByRole('button', { name: 'Save Vet' }).click();
    await expect(newVetRow.getByRole('cell').nth(1)).toHaveText('api testing ninja');
   
    const deleteVetResponse = await request.delete(`https://petclinic-api.bondaracademy.com/petclinic/api/vets/${newVetId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    expect(deleteVetResponse.status()).toEqual(204);

    const deleteSpecialtyResponse = await request.delete(`https://petclinic-api.bondaracademy.com/petclinic/api/specialties/${newSpecialtyId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    expect(deleteSpecialtyResponse.status()).toEqual(204);

    await pm.navigateTo().specialtiesPage();
    await expect(page.getByRole('row', { name: "api testing ninja" })).not.toBeVisible();
});
