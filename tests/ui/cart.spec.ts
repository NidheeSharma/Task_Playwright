import { test, expect } from '../../src/fixtures';
import { parsePrice } from '../../src/utils/helpers';

test.describe('Cart', () => {
  test(
    'UI | Add two products to cart, verify price, quantity, total and remove one | TC-004',
    { tag: ['@regression', '@ui'] },
    async ({ pages, api }) => {
      test.info().annotations.push({ type: 'TC', description: 'TC-004' });

      const catalog = await test.step('Load reference prices from API', async () => {
        const res = await api.products.list();
        expect(res.responseCode, 'responseCode').toBe(200);
        return new Map(res.data.products.map((p) => [p.name.trim(), parsePrice(p.price)]));
      });

      const [first, second] = await test.step('Add two products from the products page', async () => {
        await pages.products.open();
        const firstName = await pages.products.addToCartByIndex(0);
        await pages.products.continueShopping();
        const secondName = await pages.products.addToCartByIndex(1);
        return [firstName, secondName] as const;
      });
      expect(first, 'two different products added').not.toBe(second);

      const cart = await test.step('Open the cart', async () => {
        const page = await pages.products.viewCartFromModal();
        await expect(page.rows).toHaveCount(2);
        return page;
      });

      await test.step('Verify names, prices, quantity and totals', async () => {
        const items = await cart.getItems();
        expect(items.map((i) => i.name).sort()).toEqual([first, second].sort());
        for (const item of items) {
          const expectedPrice = catalog.get(item.name);
          expect(expectedPrice, `API price exists for ${item.name}`).toBeDefined();
          expect(item.price, `price of ${item.name}`).toBe(expectedPrice);
          expect(item.quantity, `quantity of ${item.name}`).toBe(1);
          expect(item.total, `total of ${item.name}`).toBe(item.price * item.quantity);
        }
      });

      await test.step('Remove the second product', async () => {
        await cart.removeItem(second);
        await expect(cart.rows).toHaveCount(1);
        await expect(cart.row(second)).toHaveCount(0);
        await expect(cart.row(first)).toHaveCount(1);
      });
    },
  );
});