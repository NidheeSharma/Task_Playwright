# TC-007: Brands list API schema
- Status: Ready
- Type: API
- Priority: P3
- Tags: @regression, @api
- Automated: Yes
- Spec: tests/api/products.api.spec.ts

## Preconditions
None.

## Test data
None.

## Steps
1. GET /api/brandsList.
2. Validate each brand's fields.

## Expected results
- responseCode 200 and non-empty brands list.
- Each brand has id and brand.

## Cleanup
None.

## Automation notes
-
