import { expect } from '@playwright/test';
import { HelperBase } from './helperBase';

export class AddNewOwnerPage extends HelperBase {

    /**
     * Add a new owner with provided details
     * @param firstName Owner's first name
     * @param lastName Owner's last name
     * @param address Owner's address
     * @param city Owner's city
     * @param telephone Owner's telephone
     */
    async addNewOwner(firstName: string, lastName: string, address: string, city: string, telephone: string) {
        await this.page.getByRole('textbox', { name: 'First Name' }).fill(firstName);
        await this.page.getByRole('textbox', { name: 'Last Name' }).fill(lastName);
        await this.page.getByRole('textbox', { name: 'Address' }).fill(address);
        await this.page.getByRole('textbox', { name: 'City' }).fill(city);
        await this.page.getByRole('textbox', { name: 'Telephone' }).fill(telephone);
        await this.page.getByRole('button', { name: 'Add Owner' }).click();
    }
}
