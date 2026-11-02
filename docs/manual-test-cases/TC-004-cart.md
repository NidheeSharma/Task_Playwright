# TC-004: Add products to cart and verify price, quantity and total
- Status: Ready
- Type: UI (API for reference prices)
- Priority: P1
- Tags: @regression, @ui
- Automated: Yes
- Spec: tests/ui/cart.spec.ts

## Preconditions
None (guest).

## Test data
Reference prices from GET /api/productsList.

## Steps
1. Load product prices via API.
2. Add product 1, Continue Shopping.
3. Add product 2, View Cart.
4. Read cart rows.
5. Remove product 2.

## Expected results
- Cart has exactly 2 rows with the added names.
- Each price equals API price; quantity 1; total = price x quantity.
- After removal: 1 row, removed product absent.

## Cleanup
None (guest cart is session scoped).

## Automation notes
Cart: /view_cart, #cart_info_table tbody tr. Prices shown as 'Rs. 500'.
