import { Page } from '@playwright/test';
import { NavigationPage } from './navigationPage';
import { OwnersPage } from './ownersPage';
import { OwnerInformationPage } from './ownerInformationPage';
import { PetDetailsPage } from './petDetailsPage';
import { VeterinariansPage } from './veterinariansPage';
import { EditVeterinarianPage } from './editVeterinarianPage';
import { AddNewPetPage } from './addNewPetPage';
import { PetTypesPage } from './petTypesPage';
import { SpecialtiesPage } from './specialtiesPage';
import { AddNewOwnerPage } from './addNewOwnerPage';

export class PageManager {
    readonly page: Page;
    private readonly navigationPage: NavigationPage;
    private readonly ownersPage: OwnersPage;
    private readonly ownerInformationPage: OwnerInformationPage;
    private readonly petDetailsPage: PetDetailsPage;
    private readonly veterinariansPage: VeterinariansPage;
    private readonly editVeterinarianPage: EditVeterinarianPage;
    private readonly addNewPetPage: AddNewPetPage;
    private readonly petTypesPage: PetTypesPage;
    private readonly specialtiesPage: SpecialtiesPage;
    private readonly addNewOwnerPage: AddNewOwnerPage;

    constructor(page: Page) {
        this.page = page;
        this.navigationPage = new NavigationPage(this.page);
        this.ownersPage = new OwnersPage(this.page);
        this.ownerInformationPage = new OwnerInformationPage(this.page);
        this.petDetailsPage = new PetDetailsPage(this.page);
        this.veterinariansPage = new VeterinariansPage(this.page);
        this.editVeterinarianPage = new EditVeterinarianPage(this.page);
        this.addNewPetPage = new AddNewPetPage(this.page);
        this.petTypesPage = new PetTypesPage(this.page);
        this.specialtiesPage = new SpecialtiesPage(this.page);
        this.addNewOwnerPage = new AddNewOwnerPage(this.page);
    }

    navigateTo() {
        return this.navigationPage;
    }

    onOwnersPage() {
        return this.ownersPage;
    }

    onOwnerInformationPage() {
        return this.ownerInformationPage;
    }

    onPetDetailsPage() {
        return this.petDetailsPage;
    }

    onVeterinariansPage() {
        return this.veterinariansPage;
    }

    onEditVeterinarianPage() {
        return this.editVeterinarianPage;
    }

    onAddNewPetPage() {
        return this.addNewPetPage;
    }

    onPetTypesPage() {
        return this.petTypesPage;
    }

    onSpecialtiesPage() {
        return this.specialtiesPage;
    }

    onAddNewOwnerPage() {
        return this.addNewOwnerPage;
    }
}
