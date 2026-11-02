# TC-001: Register a new user via UI and verify the account via API
- Status: Ready
- Type: Hybrid (UI -> API)
- Priority: P1
- Tags: @smoke, @hybrid
- Automated: Yes
- Spec: tests/hybrid/register-verify.spec.ts

## Preconditions
Email not already registered.

## Test data
Unique email, generated name/password/address (faker).

## Steps
1. Open home page, click Signup / Login.
2. Enter name and unique email under New User Signup!, click Signup.
3. Fill account information form and click Create Account.
4. Verify ACCOUNT CREATED! and click Continue.
5. Call GET /api/getUserDetailByEmail?email=<email>.

## Expected results
- ACCOUNT CREATED! heading visible.
- Header shows 'Logged in as <name>' and Logout link.
- API responseCode 200 and user.email, name, first_name, city match input.

## Cleanup
DELETE /api/deleteAccount -> responseCode 200, 'Account deleted!'.

## Automation notes
data-qa: signup-name, signup-email, signup-button, create-account, account-created, continue-button.
