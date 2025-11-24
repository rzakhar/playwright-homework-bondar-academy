import { faker } from '@faker-js/faker';

export class RandomDataGenerator {
    getRandomFirstName(): string {
        return faker.person.firstName();
    };

    getRandomLastName(): string {
        return faker.person.lastName();
    };

    getRandomAddress(): string {
        return faker.location.streetAddress();
    };

    getRandomCity(): string {
        return faker.location.city();
    };

    getRandomTelephone(): string {
        return faker.string.numeric(10);
    };

    getRandomPetName(): string {
        return faker.animal.petName();
    };

    getRandomPetVisitDescription(): string {
        return faker.lorem.sentence({ min: 3, max: 5 })
    };
}
