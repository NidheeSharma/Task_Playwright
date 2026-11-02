import type { Locator, Page } from '@playwright/test';
import type { PaymentData } from '../data/factory';
import { BasePage } from './BasePage';

export class OrderPlacedPage extends BasePage {
  readonly heading: Locator;
  readonly message: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByTestId('order-placed');
    this.message = page.getByText('Congratulations! Your order has been confirmed!');
  }
}

export class PaymentPage extends BasePage {
  readonly nameOnCard: Locator;
  readonly cardNumber: Locator;
  readonly cvc: Locator;
  readonly expiryMonth: Locator;
  readonly expiryYear: Locator;
  readonly payButton: Locator;

  constructor(page: Page) {
    super(page);
    this.nameOnCard = page.getByTestId('name-on-card');
    this.cardNumber = page.getByTestId('card-number');
    this.cvc = page.getByTestId('cvc');
    this.expiryMonth = page.getByTestId('expiry-month');
    this.expiryYear = page.getByTestId('expiry-year');
    this.payButton = page.getByTestId('pay-button');
  }

  async pay(payment: PaymentData): Promise<OrderPlacedPage> {
    await this.nameOnCard.fill(payment.nameOnCard);
    await this.cardNumber.fill(payment.cardNumber);
    await this.cvc.fill(payment.cvc);
    await this.expiryMonth.fill(payment.expiryMonth);
    await this.expiryYear.fill(payment.expiryYear);
    await this.payButton.click();
    return new OrderPlacedPage(this.page);
  }
}
