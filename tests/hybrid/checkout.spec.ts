import { test, expect } from '../../src/fixtures';
import { buildPayment } from '../../src/data/factory';
import { normalizeText } from '../../src/utils/helpers';

test.describe('Checkout', () => {
  test(
    'Hybrid | Place order end to end as a logged-in user | TC-005',
    { tag: ['@smoke', '@regression', '@hybrid'] },
    async ({ pages, registeredUser }) => {
      test.info().annotations.push({ type: 'TC', description: 'TC-005' });

      await test.step('Log in (account created via API)', async () => {
        await pages.login.open();
        await pages.login.login(registeredUser.email, registeredUser.password);
        await expect(pages.home.loggedInAs).toContainText(registeredUser.name);
      });

      await test.step('Add a product and open the cart', async () => {
        await pages.products.open();
        await pages.products.addToCartByIndex(0);
        const cart = await pages.products.viewCartFromModal();
        await expect(cart.rows).toHaveCount(1);
      });

      const payment = await test.step('Proceed to checkout and verify address', async () => {
        const checkout = await pages.cart.proceedToCheckout();
        const address = normalizeText(await checkout.getDeliveryAddressText());
        expect(address).toContain(registeredUser.address1);
        expect(address).toContain(registeredUser.city);
        expect(address).toContain(registeredUser.zipcode);
        expect(address).toContain(registeredUser.mobile_number);
        return checkout.placeOrder('Automated order - please ignore');
      });

      await test.step('Pay and verify order confirmation', async () => {
        const placed = await payment.pay(buildPayment());
        await expect(placed.heading).toContainText(/order placed/i);
        await expect(placed.message).toBeVisible();
      });

      await test.step('Verify cart is empty afterwards', async () => {
        await pages.cart.open();
        await expect(pages.cart.emptyMessage).toBeVisible();
        await expect(pages.cart.rows).toHaveCount(0);
      });
    },
  );
});
