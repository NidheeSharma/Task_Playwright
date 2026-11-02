import { test, expect } from '../../src/fixtures';
import { MESSAGES, RESPONSE_CODE } from '../../src/data/constants';
import { validateShape } from '../../src/utils/schema';

test.describe('Products API', () => {
  test(
    'API | Products list returns valid schema | TC-006',
    { tag: ['@smoke', '@regression', '@api'] },
    async ({ api }) => {
      test.info().annotations.push({ type: 'TC', description: 'TC-006' });
      const res = await api.products.list();
      expect(res.httpStatus, 'HTTP status').toBe(200);
      expect(res.responseCode, 'responseCode').toBe(RESPONSE_CODE.ok);
      expect(res.data.products.length, 'product count').toBeGreaterThan(0);
      for (const product of res.data.products) {
        const problems = validateShape(product, { id: 'number', name: 'string', price: 'string', brand: 'string' });
        expect(problems, `schema of product ${product.id}`).toEqual([]);
      }
      const ids = res.data.products.map((p) => p.id);
      expect(new Set(ids).size, 'product ids are unique').toBe(ids.length);
    },
  );

  test(
    'API | Brands list returns valid schema | TC-007',
    { tag: ['@regression', '@api'] },
    async ({ api }) => {
      test.info().annotations.push({ type: 'TC', description: 'TC-007' });
      const res = await api.products.brands();
      expect(res.responseCode, 'responseCode').toBe(RESPONSE_CODE.ok);
      expect(res.data.brands.length, 'brand count').toBeGreaterThan(0);
      for (const brand of res.data.brands) {
        expect(validateShape(brand, { id: 'number', brand: 'string' }), `schema of brand ${brand.id}`).toEqual([]);
      }
    },
  );

  test(
    'API | POST on productsList is not supported | TC-006',
    { tag: ['@regression', '@api', '@negative'] },
    async ({ api }) => {
      test.info().annotations.push({ type: 'TC', description: 'TC-006' });
      const res = await api.products.listWithPost();
      expect(res.responseCode, 'responseCode').toBe(RESPONSE_CODE.methodNotAllowed);
      expect(res.message).toBe(MESSAGES.methodNotSupported);
    },
  );
});
