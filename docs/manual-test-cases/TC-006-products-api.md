# TC-006: Products list API: schema and unsupported method
- Status: Ready
- Type: API
- Priority: P2
- Tags: @smoke, @regression, @api, @negative
- Automated: Yes
- Spec: tests/api/products.api.spec.ts

## Preconditions
None.

## Test data
None.

## Steps
1. GET /api/productsList.
2. Validate each product's fields.
3. POST /api/productsList.

## Expected results
- HTTP 200 and responseCode 200; non-empty list; unique ids.
- Each product has id, name, price, brand.
- POST: responseCode 405, 'This request method is not supported.'

## Cleanup
None.

## Automation notes
responseCode is in the body, not always the HTTP status.
