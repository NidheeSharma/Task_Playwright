import type { Locator, Page, Response } from '@playwright/test';
import { parsePrice } from '../utils/helpers';
import { BasePage } from './BasePage';
import { CheckoutPage } from './CheckoutPage';

export interface CartItem {
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export class CartPage extends BasePage {
  readonly rows: Locator;
  readonly emptyMessage: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.rows = page.locator('#cart_info_table tbody tr');
    this.emptyMessage = page.locator('#empty_cart');
    this.checkoutButton = page.locator('a.check_out');
  }

  async open(): Promise<void> {
    await this.goto('/view_cart');
  }

  row(name: string): Locator {
    return this.rows.filter({ has: this.page.locator('.cart_description a', { hasText: name }) });
  }

  async getItems(): Promise<CartItem[]> {
    const count = await this.rows.count();
    const items: CartItem[] = [];
    for (let i = 0; i < count; i++) {
      const row = this.rows.nth(i);
      items.push({
        name: (await row.locator('.cart_description a').innerText()).trim(),
        price: parsePrice(await row.locator('.cart_price p').innerText()),
        quantity: Number((await row.locator('.cart_quantity button').innerText()).trim()),
        total: parsePrice(await row.locator('.cart_total_price').innerText()),
      });
    }
    return items;
  }

  /**
   * Removes a cart row. The delete link triggers a request to /delete_cart/<id>; we wait for
   * it explicitly so a swallowed click fails loudly instead of silently doing nothing.
   */
  async removeItem(name: string): Promise<void> {
    const deleteLink = this.row(name).locator('.cart_quantity_delete');
    await this.scrollIntoView(deleteLink);
    await this.dismissAds();
    let response = await this.clickAndWaitForDelete(() => deleteLink.click(), 5_000).catch(() => undefined);
    if (!response) {
      // Fallback: fire the click event directly in case an overlay swallowed the real click.
      response = await this.clickAndWaitForDelete(() => deleteLink.dispatchEvent('click'), 10_000);
    }
    if (response.status() >= 400) {
      throw new Error(`Cart delete failed with HTTP ${response.status()} for "${name}"`);
    }
  }

  private async clickAndWaitForDelete(trigger: () => Promise<void>, timeout: number): Promise<Response> {
    const [response] = await Promise.all([
      this.page.waitForResponse((r) => r.url().includes('/delete_cart/'), { timeout }),
      trigger(),
    ]);
    return response;
  }

  async proceedToCheckout(): Promise<CheckoutPage> {
    await this.scrollIntoView(this.checkoutButton);
    await this.dismissAds();
    await this.checkoutButton.click();
    // Fails with a clear message if the click does not navigate.
    await this.page.waitForURL('**/checkout', { timeout: 10_000 });
    return new CheckoutPage(this.page);
  }
}