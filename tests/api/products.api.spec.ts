import { test, expect } from '../../src/fixtures';
import { MESSAGES, RESPONSE_CODE } from '../../src/data/constants';
import { validateShape } from '../../src/utils/schema';

/**
 * Products API tests (TC-006, TC-007)
 * These tests use only the `api` fixture, so no browser is opened.
 * Note: the site often returns HTTP 200 and puts the real status in the body field `responseCode`,
 * so each test checks the `responseCode` value (and the HTTP status where it matters).
 */
test.describe('Products API', () => {
  // TC-006 (positive): GET /api/productsList returns a valid, non-empty list of products
  test(
    'API | Products list returns valid schema | TC-006',
    { tag: ['@smoke', '@regression', '@api'] },
    async ({ api }) => {
      // Link this test to its manual test case (shows up in the reports)
      test.info().annotations.push({ type: 'TC', description: 'TC-006' });

      // Call the endpoint through the typed API client
      const res = await api.products.list();

      // 1. The request succeeded: check both the HTTP status and the status inside the body
      expect(res.httpStatus, 'HTTP status').toBe(200);
      expect(res.responseCode, 'responseCode').toBe(RESPONSE_CODE.ok);

      // 2. The list is not empty
      expect(res.data.products.length, 'product count').toBeGreaterThan(0);

      // 3. Every product has the expected fields with the right types
      //    (validateShape returns a list of problems; an empty list means the product is valid)
      for (const product of res.data.products) {
        const problems = validateShape(product, { id: 'number', name: 'string', price: 'string', brand: 'string' });
        expect(problems, `schema of product ${product.id}`).toEqual([]);
      }

      // 4. Product ids are unique (no duplicate records)
      const ids = res.data.products.map((p) => p.id);
      expect(new Set(ids).size, 'product ids are unique').toBe(ids.length);
    },
  );

  // TC-007 (positive): GET /api/brandsList returns a valid, non-empty list of brands
  test(
    'API | Brands list returns valid schema | TC-007',
    { tag: ['@regression', '@api'] },
    async ({ api }) => {
      test.info().annotations.push({ type: 'TC', description: 'TC-007' });

      const res = await api.products.brands();

      // The request succeeded and returned at least one brand
      expect(res.responseCode, 'responseCode').toBe(RESPONSE_CODE.ok);
      expect(res.data.brands.length, 'brand count').toBeGreaterThan(0);

      // Every brand has a numeric id and a text name
      for (const brand of res.data.brands) {
        expect(validateShape(brand, { id: 'number', brand: 'string' }), `schema of brand ${brand.id}`).toEqual([]);
      }
    },
  );

  // TC-006 (negative): the endpoint only supports GET, so POST must be rejected
  test(
    'API | POST on productsList is not supported | TC-006',
    { tag: ['@regression', '@api', '@negative'] },
    async ({ api }) => {
      test.info().annotations.push({ type: 'TC', description: 'TC-006' });

      // Send a POST request to an endpoint that only allows GET
      const res = await api.products.listWithPost();

      // The API answers with 405 (method not allowed) and its standard message
      expect(res.responseCode, 'responseCode').toBe(RESPONSE_CODE.methodNotAllowed);
      expect(res.message).toBe(MESSAGES.methodNotSupported);
    },
  );
});