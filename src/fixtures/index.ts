import { test as base, expect, type Page } from '@playwright/test';
import { ApiClient, ProductApi, UserApi } from '../api';
import { buildUser, type UserData } from '../data/factory';
import { RESPONSE_CODE } from '../data/constants';
import { CartPage, CheckoutPage, HomePage, LoginPage, PaymentPage, ProductsPage, SignupPage } from '../pages';
import { logger } from '../utils/logger';

export interface PageObjects {
  home: HomePage;
  login: LoginPage;
  signup: SignupPage;
  products: ProductsPage;
  cart: CartPage;
  checkout: CheckoutPage;
  payment: PaymentPage;
}

export interface Apis {
  users: UserApi;
  products: ProductApi;
}

type Fixtures = {
  pages: PageObjects;
  api: Apis;
  registeredUser: UserData;
};

const AD_HOSTS = /(googlesyndication|doubleclick|googletagservices|google-analytics|adservice\.google|pagead)/;

function buildPages(page: Page): PageObjects {
  return {
    home: new HomePage(page),
    login: new LoginPage(page),
    signup: new SignupPage(page),
    products: new ProductsPage(page),
    cart: new CartPage(page),
    checkout: new CheckoutPage(page),
    payment: new PaymentPage(page),
  };
}

export const test = base.extend<Fixtures>({
  // Block third-party ad requests so overlays do not intercept clicks.
  page: async ({ page }, use) => {
    await page.route(AD_HOSTS, (route) => route.abort());
    await use(page);
  },

  pages: async ({ page }, use) => {
    await use(buildPages(page));
  },

  api: async ({ request }, use) => {
    const client = new ApiClient(request);
    await use({ users: new UserApi(client), products: new ProductApi(client) });
  },

  /** Account created through the API; always deleted afterwards (teardown never throws). */
  registeredUser: async ({ api }, use) => {
    const user = buildUser();
    const created = await api.users.create(user);
    if (created.responseCode !== RESPONSE_CODE.created) {
      throw new Error(`Setup failed: createAccount returned ${created.responseCode} ${created.message ?? ''}`);
    }
    await use(user);
    try {
      const deleted = await api.users.delete(user.email, user.password);
      if (deleted.responseCode !== RESPONSE_CODE.ok) {
        logger.warn('Teardown: deleteAccount did not return 200', { email: user.email, code: deleted.responseCode });
      }
    } catch (error) {
      logger.warn('Teardown: deleteAccount threw', { email: user.email, error: String(error) });
    }
  },
});

export { expect };
