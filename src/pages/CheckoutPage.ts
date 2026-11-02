import type { Locator, Page } from '@playwright/test';
import { normalizeText } from '../utils/helpers';
import { BasePage } from './BasePage';
import { PaymentPage } from './PaymentPage';

export class CheckoutPage extends BasePage {
  readonly deliveryAddress: Locator;
  readonly billingAddress: Locator;
  readonly commentBox: Locator;
  readonly placeOrderLink: Locator;

  constructor(page: Page) {
    super(page);
    this.deliveryAddress = page.locator('#address_delivery');
    this.billingAddress = page.locator('#address_invoice');
    this.commentBox = page.locator('textarea[name="message"]');
    this.placeOrderLink = page.getByRole('link', { name: 'Place Order' });
  }

  async getDeliveryAddressText(): Promise<string> {
    return normalizeText(await this.deliveryAddress.innerText());
  }

  async placeOrder(comment: string): Promise<PaymentPage> {
    await this.commentBox.fill(comment);
    await this.placeOrderLink.click();
    return new PaymentPage(this.page);
  }
}
