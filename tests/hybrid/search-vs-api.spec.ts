import { test, expect } from '../../src/fixtures';
import { MESSAGES, RESPONSE_CODE } from '../../src/data/constants';
import { normalizeText } from '../../src/utils/helpers';

// Search terms used for the data-driven test below: one test is generated for each term
const SEARCH_TERMS = ['tshirt', 'dress'];

/**
 * Search tests (TC-003)
 * Hybrid flow (API -> UI): the API returns the expected search results first,
 * then the UI search is run with the same term and its results are compared with the API.
 */
test.describe('Search', () => {
  // Data-driven: this loop creates one separate test per search term (the term is in the test name)
  for (const term of SEARCH_TERMS) {
    // TC-003 (positive): UI search results must match the API search results
    test(
      `Hybrid | Search "${term}" results match API | TC-003`,
      { tag: ['@smoke', '@regression', '@hybrid'] },
      async ({ pages, api }) => {
        // Link this test to its manual test case (shows up in the reports)
        test.info().annotations.push({ type: 'TC', description: 'TC-003' });

        // Step 1: search through the API and keep the product names as the expected result.
        // The step returns the sorted names so the next steps can use them.
        const apiNames = await test.step('Search via API', async () => {
          const res = await api.products.search(term);
          // The site can return HTTP 200 with the real status in the body, so check both
          expect(res.httpStatus, 'HTTP status').toBe(200);
          expect(res.responseCode, 'responseCode').toBe(RESPONSE_CODE.ok);
          // Make sure the search found something, otherwise the comparison would prove nothing
          expect(res.data.products.length, 'API result count').toBeGreaterThan(0);
          // normalizeText removes extra spaces; sort() makes the comparison independent of order
          return res.data.products.map((p) => normalizeText(p.name)).sort();
        });

        // Step 2: run the same search in the browser
        await test.step('Search via UI', async () => {
          await pages.products.open();
          await pages.products.search(term);
          // The "Searched Products" heading confirms the search results page is shown
          await expect(pages.products.searchedHeading).toBeVisible();
        });

        // Step 3: compare what the UI shows with what the API returned
        await test.step('Compare UI results with API', async () => {
          // Same number of products...
          await expect(pages.products.cards).toHaveCount(apiNames.length);
          // ...and the same product names
          const uiNames = (await pages.products.getProductNames()).map(normalizeText).sort();
          expect(uiNames).toEqual(apiNames);
        });
      },
    );
  }

  // TC-003 (negative): searching without the required `search_product` parameter is rejected
  test(
    'API | Search without search_product returns 400 | TC-003',
    { tag: ['@regression', '@api', '@negative'] },
    async ({ api }) => {
      test.info().annotations.push({ type: 'TC', description: 'TC-003' });

      // Send the request with an empty form, so the required parameter is missing
      const res = await api.products.searchRaw({});

      // The API answers 400 (bad request) with its standard message
      expect(res.responseCode, 'responseCode').toBe(RESPONSE_CODE.badRequest);
      expect(res.message).toBe(MESSAGES.searchParamMissing);
    },
  );
});