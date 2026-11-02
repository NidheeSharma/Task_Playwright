# TC-003: Search a product and compare UI results with API
- Status: Ready
- Type: Hybrid (API -> UI)
- Priority: P1
- Tags: @smoke, @regression, @hybrid, @negative
- Automated: Yes
- Spec: tests/hybrid/search-vs-api.spec.ts

## Preconditions
None (guest).

## Test data
Search terms: tshirt, dress.

## Steps
1. POST /api/searchProduct with search_product=<term>.
2. Open /products, search the same term.
3. Count and read product names under Searched Products.
4. Compare with API.
5. Negative: POST /api/searchProduct without search_product.

## Expected results
- API responseCode 200 and non-empty products.
- Searched Products heading visible.
- UI card count equals API count and names match.
- Negative: responseCode 400, 'Bad request, search_product parameter is missing in POST request.'

## Cleanup
None.

## Automation notes
#search_product, #submit_search, .features_items .product-image-wrapper.
