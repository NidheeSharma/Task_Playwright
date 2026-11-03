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
/** Tests never assert on images, fonts or media; skipping them makes the slow site much faster. */
const BLOCKED_RESOURCE_TYPES = new Set(['image', 'font', 'media']);

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

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Creates the account, tolerating a slow or flaky server. createAccount is not idempotent, so after a
 * timeout or 5xx we first check (read-only) whether the account was created before trying again.
 */
async function createAccountSafely(api: Apis, user: UserData): Promise<void> {
  const maxAttempts = 3;
  let lastProblem = 'unknown';
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const created = await api.users.create(user);
      if (created.responseCode === RESPONSE_CODE.created) return;
      lastProblem = `createAccount returned ${created.responseCode} ${created.message ?? ''}`.trim();
      if (created.httpStatus < 500 && created.responseCode !== created.httpStatus) {
        // A real business error (for example 400), not a server problem: do not retry.
        throw new Error(`Setup failed: ${lastProblem}`);
      }
    } catch (error) {
      if (error instanceof Error && error.message.startsWith('Setup failed')) throw error;
      lastProblem = String(error);
    }
    try {
      const exists = await api.users.verifyLogin(user.email, user.password);
      if (exists.responseCode === RESPONSE_CODE.ok) return;
    } catch (error) {
      lastProblem = `${lastProblem}; verify failed: ${String(error)}`;
    }
    logger.warn(`createAccount attempt ${attempt} failed, retrying`, { problem: lastProblem });
    await sleep(1000 * attempt);
  }
  throw new Error(`Setup failed after ${maxAttempts} attempts: ${lastProblem}`);
}

export const test = base.extend<Fixtures>({
  // Block ads and heavy static resources so overlays do not intercept clicks and pages load fast.
  page: async ({ page }, use) => {
    await page.route('**/*', async (route) => {
      const request = route.request();
      if (BLOCKED_RESOURCE_TYPES.has(request.resourceType()) || AD_HOSTS.test(request.url())) {
        await route.abort();
        return;
      }
      await route.continue();
    });
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
    await createAccountSafely(api, user);
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
