import { test, expect } from '../../src/fixtures';
import { buildPayment } from '../../src/data/factory';
import { normalizeText } from '../../src/utils/helpers';

/**
 * Checkout test (TC-005)
 * Hybrid flow: the account is created through the API (fast and reliable setup),
 * then the whole purchase is performed and verified in the browser.
 */
test.describe('Checkout', () => {
  // TC-005 (positive): a logged-in user places an order end to end
  test(
    'Hybrid | Place order end to end as a logged-in user | TC-005',
    { tag: ['@smoke', '@regression', '@hybrid'] },
    async ({ pages, registeredUser }) => {
      // Link this test to its manual test case (shows up in the reports)
      test.info().annotations.push({ type: 'TC', description: 'TC-005' });

      // `registeredUser` is created through the API by the fixture before the test starts
      // and deleted automatically afterwards, so this test needs no cleanup code.

      // Step 1: log in through the UI with the API-created account
      await test.step('Log in (account created via API)', async () => {
        await pages.login.open();
        await pages.login.login(registeredUser.email, registeredUser.password);
        // Proof that the login worked: the header shows the user's name
        await expect(pages.home.loggedInAs).toContainText(registeredUser.name);
      });

      // Step 2: add the first product on the products page, then open the cart from the popup
      await test.step('Add a product and open the cart', async () => {
        await pages.products.open();
        await pages.products.addToCartByIndex(0);
        const cart = await pages.products.viewCartFromModal();
        // Exactly one item must be in the cart
        await expect(cart.rows).toHaveCount(1);
      });

      // Step 3: go to checkout, verify the delivery address, add a comment and place the order.
      // The step returns the payment page so the next step can use it.
      const payment = await test.step('Proceed to checkout and verify address', async () => {
        const checkout = await pages.cart.proceedToCheckout();

        // The delivery address must show the details of the account we created through the API.
        // normalizeText removes extra spaces and line breaks so the comparison is reliable.
        const address = normalizeText(await checkout.getDeliveryAddressText());
        expect(address).toContain(registeredUser.address1);
        expect(address).toContain(registeredUser.city);
        expect(address).toContain(registeredUser.zipcode);
        expect(address).toContain(registeredUser.mobile_number);

        return checkout.placeOrder('Automated order - please ignore');
      });

      // Step 4: enter the practice-site test card (never a real card) and confirm the order
      await test.step('Pay and verify order confirmation', async () => {
        const placed = await payment.pay(buildPayment());
        // The confirmation heading and message prove the order was accepted
        await expect(placed.heading).toContainText(/order placed/i);
        await expect(placed.message).toBeVisible();
      });

      // Step 5: after a successful order the cart must be empty again
      await test.step('Verify cart is empty afterwards', async () => {
        await pages.cart.open();
        await expect(pages.cart.emptyMessage).toBeVisible();
        await expect(pages.cart.rows).toHaveCount(0);
      });
    },
  );
});