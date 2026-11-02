import { faker } from '@faker-js/faker';
import { randomUUID } from 'node:crypto';

export interface UserData {
  name: string;
  email: string;
  password: string;
  title: 'Mr' | 'Mrs';
  birth_date: string;
  birth_month: string;
  birth_year: string;
  firstname: string;
  lastname: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  zipcode: string;
  state: string;
  city: string;
  mobile_number: string;
}

export interface PaymentData {
  nameOnCard: string;
  cardNumber: string;
  cvc: string;
  expiryMonth: string;
  expiryYear: string;
}

export function uniqueEmail(prefix = 'qa'): string {
  return `${prefix}_${Date.now()}_${randomUUID().slice(0, 8)}@example.com`;
}

export function buildUser(overrides: Partial<UserData> = {}): UserData {
  const firstname = faker.person.firstName();
  const lastname = faker.person.lastName();
  return {
    name: `${firstname}${faker.string.alpha(4)}`,
    email: uniqueEmail(),
    password: `Pw!${faker.string.alphanumeric(10)}`,
    title: 'Mr',
    birth_date: '15',
    birth_month: 'May',
    birth_year: '1990',
    firstname,
    lastname,
    company: faker.company.name(),
    address1: faker.location.streetAddress(),
    address2: faker.location.secondaryAddress(),
    country: 'India',
    zipcode: faker.string.numeric(6),
    state: faker.location.state(),
    city: faker.location.city(),
    mobile_number: faker.string.numeric(10),
    ...overrides,
  };
}

/** Practice-site test card only. Never use real card numbers. */
export function buildPayment(overrides: Partial<PaymentData> = {}): PaymentData {
  return {
    nameOnCard: 'QA User',
    cardNumber: '4111111111111111',
    cvc: '123',
    expiryMonth: '12',
    expiryYear: '2030',
    ...overrides,
  };
}
