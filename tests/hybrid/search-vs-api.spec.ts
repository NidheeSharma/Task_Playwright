import { test, expect } from '../../src/fixtures';
import { MESSAGES, RESPONSE_CODE } from '../../src/data/constants';
import { normalizeText } from '../../src/utils/helpers';

const SEARCH_TERMS = ['tshirt', 'dress'];

test.describe('Search', () => {
  for (const term of SEARCH_TERMS) {
    test(
      `Hybrid | Search "${term}" results match API | TC-003`,
      { tag: ['@smoke', '@regression', '@hybrid'] },
      async ({ pages, api }) => {
        test.info().annotations.push({ type: 'TC', description: 'TC-003' });

        const apiNames = await test.step('Search via API', async () => {
          const res = await api.products.search(term);
          expect(res.httpStatus, 'HTTP status').toBe(200);
          expect(res.responseCode, 'responseCode').toBe(RESPONSE_CODE.ok);
          expect(res.data.products.length, 'API result count').toBeGreaterThan(0);
          return res.data.products.map((p) => normalizeText(p.name)).sort();
        });

        await test.step('Search via UI', async () => {
          await pages.products.open();
          await pages.products.search(term);
          await expect(pages.products.searchedHeading).toBeVisible();
        });

        await test.step('Compare UI results with API', async () => {
          await expect(pages.products.cards).toHaveCount(apiNames.length);
          const uiNames = (await pages.products.getProductNames()).map(normalizeText).sort();
          expect(uiNames).toEqual(apiNames);
        });
      },
    );
  }

  test(
    'API | Search without search_product returns 400 | TC-003',
    { tag: ['@regression', '@api', '@negative'] },
    async ({ api }) => {
      test.info().annotations.push({ type: 'TC', description: 'TC-003' });
      const res = await api.products.searchRaw({});
      expect(res.responseCode, 'responseCode').toBe(RESPONSE_CODE.badRequest);
      expect(res.message).toBe(MESSAGES.searchParamMissing);
    },
  );
});
