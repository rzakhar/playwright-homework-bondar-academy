import { test as base, expect } from '@playwright/test';
import { PageManager } from './page-objects/pageManager';
import { faker } from '@faker-js/faker';

export type TestOptions = {
    tempOwnerWithTeardown: [ownerId: string, ownerName: string, address: string, city: string, telephone: string];
    tempPet: [petId: string, ownerId: string, petName: string, birthDate: Date, type: string];
    tempVisit: [visitId: string, visitDescription: string, visitDate: Date];
    pageManager: PageManager;
};

export const test = base.extend<TestOptions>({
    tempOwnerWithTeardown: async ({ request }, use) => {
        const newOwnerFirstName = faker.person.firstName();
        const newOwnerLastName = faker.person.lastName();
        const newOwnerFullName = `${newOwnerFirstName} ${newOwnerLastName}`;
        const newOwnerAddress = faker.location.streetAddress();
        const newOwnerCity = faker.location.city();
        const newOwnerTelephone = faker.string.numeric(10)

        const createOwnerResponse = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/owners', {
            data: {
                firstName: newOwnerFirstName,
                lastName: newOwnerLastName,
                address: newOwnerAddress,
                city: newOwnerCity,
                telephone: newOwnerTelephone
            }
        });
        expect(createOwnerResponse.status()).toBe(201);
        const createOwnerResponseBody = await createOwnerResponse.json();
        const newOwnerId = createOwnerResponseBody.id;

        await use([newOwnerId, newOwnerFullName, newOwnerAddress, newOwnerCity, newOwnerTelephone]);

        const deleteOwnerResponse = await request.delete(`https://petclinic-api.bondaracademy.com/petclinic/api/owners/${newOwnerId}`);
        expect(deleteOwnerResponse.status()).toEqual(204);
    },

    tempPet: async ({ request, tempOwnerWithTeardown }, use) => {
        const ownerId = tempOwnerWithTeardown[0];

        const newPetName = faker.animal.petName();
        const newPetBirthDate = '2015-02-12';
        const newPetType = 'cat';

        const createPetResponse = await request.post(`https://petclinic-api.bondaracademy.com/petclinic/api/owners/${ownerId}/pets`, {
            data: {
                name: newPetName,
                birthDate: newPetBirthDate,
                type: { id: 2462, name: newPetType }
            }
        });
        expect(createPetResponse.status()).toBe(201);
        const createPetResponseBody = await createPetResponse.json();
        const newPetId = createPetResponseBody.id;

        await use([newPetId, ownerId, newPetName, new Date(newPetBirthDate), newPetType]);
    },

    tempVisit: async ({ request, tempPet }, use) => {
        const ownerId = tempPet[1];
        const petId = tempPet[0];
        const newVisitDescription = faker.lorem.sentence({ min: 3, max: 5 });
        const newVisitDate = '2024-06-10';

        const createVisitResponse = await request.post(`https://petclinic-api.bondaracademy.com/petclinic/api/owners/${ownerId}/pets/${petId}/visits`, {
            data: {
                date: newVisitDate,
                description: newVisitDescription
            }
        });
        expect(createVisitResponse.status()).toBe(201);
        const createVisitResponseBody = await createVisitResponse.json();

        await use([createVisitResponseBody.id, newVisitDescription, new Date(newVisitDate)]);
    },

    pageManager: async ({ page }, use) => {
        await use(new PageManager(page));
    }
});