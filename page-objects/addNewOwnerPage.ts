import { expect } from '@playwright/test';
import { HelperBase } from './helperBase';

export class AddNewOwnerPage extends HelperBase {

    /**
     * Fill in the new owner details form
     * @param firstName Owner's first name
     * @param lastName Owner's last name
     * @param address Owner's address
     * @param city Owner's city
     * @param telephone Owner's telephone
     */
    async fillNewOwnerDetails(firstName: string, lastName: string, address: string, city: string, telephone: string) {
        await this.page.getByRole('textbox', { name: 'First Name' }).fill(firstName);
        await this.page.getByRole('textbox', { name: 'Last Name' }).fill(lastName);
        await this.page.getByRole('textbox', { name: 'Address' }).fill(address);
        await this.page.getByRole('textbox', { name: 'City' }).fill(city);
        await this.page.getByRole('textbox', { name: 'Telephone' }).fill(telephone);
    }

    /** 
     * Click the "Add Owner" button to submit the new owner form
     */
    async clickAddOwner() {
        await this.page.getByRole('button', { name: 'Add Owner' }).click();
    }
}
