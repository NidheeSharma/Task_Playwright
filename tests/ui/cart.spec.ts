import { test, expect } from '../../src/fixtures';
import { parsePrice } from '../../src/utils/helpers';

/**
 * Cart test (TC-004)
 * UI flow that uses the API only to get trusted reference prices:
 * the prices shown in the cart are compared with the prices from the API product list.
 * It runs as a guest, so no account setup or cleanup is needed.
 */
test.describe('Cart', () => {
  // TC-004 (positive): add two products, check price / quantity / total, then remove one
  test(
    'UI | Add two products to cart, verify price, quantity, total and remove one | TC-004',
    { tag: ['@regression', '@ui'] },
    async ({ pages, api }) => {
      // Link this test to its manual test case (shows up in the reports)
      test.info().annotations.push({ type: 'TC', description: 'TC-004' });

      // Step 1: load every product from the API and build a lookup of name -> price (as a number).
      // These are the "expected" prices; we never read expected values from the UI itself.
      const catalog = await test.step('Load reference prices from API', async () => {
        const res = await api.products.list();
        expect(res.responseCode, 'responseCode').toBe(200);
        // parsePrice turns text like "Rs. 500" into the number 500
        return new Map(res.data.products.map((p) => [p.name.trim(), parsePrice(p.price)]));
      });

      // Step 2: add the first two products from the products page.
      // The step returns both product names; destructuring gives two named variables
      // (this also avoids array-index access, which the strict TypeScript settings reject).
      const [first, second] = await test.step('Add two products from the products page', async () => {
        await pages.products.open();
        const firstName = await pages.products.addToCartByIndex(0);
        // Close the "added to cart" popup so the next product can be added
        await pages.products.continueShopping();
        const secondName = await pages.products.addToCartByIndex(1);
        return [firstName, secondName] as const;
      });
      // Safety check: the two products must be different, otherwise the test data is wrong
      expect(first, 'two different products added').not.toBe(second);

      // Step 3: open the cart from the popup; it must contain exactly the two products
      const cart = await test.step('Open the cart', async () => {
        const page = await pages.products.viewCartFromModal();
        await expect(page.rows).toHaveCount(2);
        return page;
      });

      // Step 4: read every cart row and compare it with the API prices
      await test.step('Verify names, prices, quantity and totals', async () => {
        const items = await cart.getItems();
        // The cart holds exactly the products we added (sorted, so order does not matter)
        expect(items.map((i) => i.name).sort()).toEqual([first, second].sort());
        for (const item of items) {
          const expectedPrice = catalog.get(item.name);
          // The product must exist in the API data, otherwise there is nothing to compare with
          expect(expectedPrice, `API price exists for ${item.name}`).toBeDefined();
          // Unit price in the UI equals the API price
          expect(item.price, `price of ${item.name}`).toBe(expectedPrice);
          // Each product was added once, so quantity is 1
          expect(item.quantity, `quantity of ${item.name}`).toBe(1);
          // Row total must equal unit price x quantity
          expect(item.total, `total of ${item.name}`).toBe(item.price * item.quantity);
        }
      });

      // Step 5: remove the second product; only the first one must remain
      await test.step('Remove the second product', async () => {
        await cart.removeItem(second);
        await expect(cart.rows).toHaveCount(1);
        await expect(cart.row(second)).toHaveCount(0);
        await expect(cart.row(first)).toHaveCount(1);
      });
    },
  );
});