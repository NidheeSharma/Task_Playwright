import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { CartPage } from './CartPage';

export class ProductsPage extends BasePage {
  readonly heading: Locator;
  readonly searchedHeading: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly cards: Locator;
  readonly cartModal: Locator;
  readonly continueShoppingButton: Locator;
  readonly viewCartLink: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'All Products' });
    this.searchedHeading = page.getByRole('heading', { name: 'Searched Products' });
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    this.cards = page.locator('.features_items .product-image-wrapper');
    this.cartModal = page.locator('#cartModal');
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
    this.viewCartLink = this.cartModal.getByRole('link', { name: 'View Cart' });
  }

  async open(): Promise<void> {
    await this.goto('/products');
    await this.dismissAds();
  }

  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  card(name: string): Locator {
    return this.cards.filter({ has: this.page.locator('.productinfo p', { hasText: name }) }).first();
  }

  async getProductNames(): Promise<string[]> {
    const names = await this.cards.locator('.productinfo p').allTextContents();
    return names.map((n) => n.trim());
  }

  async getProductPrice(name: string): Promise<string> {
    return (await this.card(name).locator('.productinfo h2').innerText()).trim();
  }

  /** Hover reveals the overlay button; works for any card index. */
  async addToCartByIndex(index: number): Promise<string> {
    const card = this.cards.nth(index);
    await this.scrollIntoView(card);
    const name = (await card.locator('.productinfo p').innerText()).trim();
    await card.hover();
    await card.locator('.product-overlay .add-to-cart').click();
    await this.cartModal.waitFor({ state: 'visible' });
    return name;
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
    await this.cartModal.waitFor({ state: 'hidden' });
  }

  async viewCartFromModal(): Promise<CartPage> {
    await this.viewCartLink.click();
    return new CartPage(this.page);
  }
}
