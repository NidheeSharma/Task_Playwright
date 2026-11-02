# Manual test cases

One file per case. Add new cases here (see `.claude/skills/automationexercise-framework-rules.md`).

## Traceability

| TC | Title | Type | Spec |
|---|---|---|---|
| TC-001 | Register a new user via UI and verify the account via API | Hybrid (UI -> API) | `tests/hybrid/register-verify.spec.ts` |
| TC-002 | Login with valid and invalid credentials | Hybrid (API -> UI) | `tests/hybrid/login.spec.ts` |
| TC-003 | Search a product and compare UI results with API | Hybrid (API -> UI) | `tests/hybrid/search-vs-api.spec.ts` |
| TC-004 | Add products to cart and verify price, quantity and total | UI (API for reference prices) | `tests/ui/cart.spec.ts` |
| TC-005 | Place an order end to end as a logged-in user | Hybrid (API -> UI) | `tests/hybrid/checkout.spec.ts` |
| TC-006 | Products list API: schema and unsupported method | API | `tests/api/products.api.spec.ts` |
| TC-007 | Brands list API schema | API | `tests/api/products.api.spec.ts` |
| TC-008 | Users API: account lifecycle and verifyLogin negatives | API | `tests/api/users.api.spec.ts` |
