import type { Locator, Page } from '@playwright/test';

export abstract class BasePage {
  readonly loggedInAs: Locator;
  readonly logoutLink: Locator;
  readonly signupLoginLink: Locator;
  readonly productsLink: Locator;
  readonly cartLink: Locator;
  readonly deleteAccountLink: Locator;

  constructor(protected readonly page: Page) {
    const nav = page.locator('header');
    this.loggedInAs = nav.locator('a', { hasText: 'Logged in as' });
    this.logoutLink = nav.locator('a[href="/logout"]'); // no role/testid available
    this.signupLoginLink = nav.locator('a[href="/login"]');
    this.productsLink = nav.locator('a[href="/products"]');
    this.cartLink = nav.locator('a[href="/view_cart"]');
    this.deleteAccountLink = nav.locator('a[href="/delete_account"]');
  }

  protected async goto(path: string): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  async scrollIntoView(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Ads and vignettes can intercept clicks. Third-party requests are blocked in the
   * `page` fixture; this removes any ad nodes that still render.
   */
  async dismissAds(): Promise<void> {
    // String expression keeps the DOM lib out of tsconfig (lib is ES2022 only).
    await this.page.evaluate(
      `document
        .querySelectorAll('ins.adsbygoogle, iframe[id^="aswift"], #google_vignette, [id^="google_ads"]')
        .forEach((el) => el.remove())`,
    );
  }
}
