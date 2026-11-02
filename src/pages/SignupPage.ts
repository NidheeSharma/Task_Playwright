import type { Locator, Page } from '@playwright/test';
import type { UserData } from '../data/factory';
import { BasePage } from './BasePage';

export class AccountCreatedPage extends BasePage {
  readonly heading: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByTestId('account-created');
    this.continueButton = page.getByTestId('continue-button');
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }
}

export class SignupPage extends BasePage {
  readonly heading: Locator;
  readonly titleMr: Locator;
  readonly titleMrs: Locator;
  readonly password: Locator;
  readonly day: Locator;
  readonly month: Locator;
  readonly year: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly company: Locator;
  readonly address1: Locator;
  readonly address2: Locator;
  readonly country: Locator;
  readonly state: Locator;
  readonly city: Locator;
  readonly zipcode: Locator;
  readonly mobile: Locator;
  readonly createAccountButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByText('Enter Account Information');
    this.titleMr = page.locator('#id_gender1');
    this.titleMrs = page.locator('#id_gender2');
    this.password = page.getByTestId('password');
    this.day = page.getByTestId('days');
    this.month = page.getByTestId('months');
    this.year = page.getByTestId('years');
    this.firstName = page.getByTestId('first_name');
    this.lastName = page.getByTestId('last_name');
    this.company = page.getByTestId('company');
    this.address1 = page.getByTestId('address');
    this.address2 = page.getByTestId('address2');
    this.country = page.getByTestId('country');
    this.state = page.getByTestId('state');
    this.city = page.getByTestId('city');
    this.zipcode = page.getByTestId('zipcode');
    this.mobile = page.getByTestId('mobile_number');
    this.createAccountButton = page.getByTestId('create-account');
  }

  async fillAndSubmit(user: UserData): Promise<AccountCreatedPage> {
    await (user.title === 'Mr' ? this.titleMr : this.titleMrs).check();
    await this.password.fill(user.password);
    await this.day.selectOption(user.birth_date);
    await this.month.selectOption(user.birth_month);
    await this.year.selectOption(user.birth_year);
    await this.firstName.fill(user.firstname);
    await this.lastName.fill(user.lastname);
    await this.company.fill(user.company);
    await this.address1.fill(user.address1);
    await this.address2.fill(user.address2);
    await this.country.selectOption(user.country);
    await this.state.fill(user.state);
    await this.city.fill(user.city);
    await this.zipcode.fill(user.zipcode);
    await this.mobile.fill(user.mobile_number);
    await this.createAccountButton.click();
    return new AccountCreatedPage(this.page);
  }
}
