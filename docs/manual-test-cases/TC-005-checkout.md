# TC-005: Place an order end to end as a logged-in user
- Status: Ready
- Type: Hybrid (API -> UI)
- Priority: P1
- Tags: @smoke, @regression, @hybrid
- Automated: Yes
- Spec: tests/hybrid/checkout.spec.ts

## Preconditions
User created via API.

## Test data
API-created user; test card 4111111111111111, CVC 123, 12/2030.

## Steps
1. Create user via API; log in via UI.
2. Add a product, open cart, Proceed To Checkout.
3. Verify delivery address; add comment; Place Order.
4. Enter payment details; Pay and Confirm Order.
5. Open the cart again.

## Expected results
- Delivery address contains the user's address, city, zipcode, mobile.
- ORDER PLACED! heading and confirmation message visible.
- Cart is empty afterwards.

## Cleanup
Delete user via API.

## Automation notes
data-qa: name-on-card, card-number, cvc, expiry-month, expiry-year, pay-button, order-placed.
