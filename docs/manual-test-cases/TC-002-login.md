# TC-002: Login with valid and invalid credentials
- Status: Ready
- Type: Hybrid (API -> UI)
- Priority: P1
- Tags: @smoke, @regression, @hybrid, @negative
- Automated: Yes
- Spec: tests/hybrid/login.spec.ts

## Preconditions
User created via API (responseCode 201).

## Test data
API-created user; wrong-password variant.

## Steps
1. Create user via API; confirm via verifyLogin.
2. Open /login, sign in with valid credentials.
3. Verify logged-in state, click Logout.
4. Sign in again with a wrong password.
5. Call POST /api/verifyLogin with the wrong password.

## Expected results
- Valid: 'Logged in as <name>' and Logout link visible.
- After logout: URL /login and login heading visible.
- Invalid: 'Your email or password is incorrect!' visible, no logged-in state.
- verifyLogin wrong password: responseCode 404, 'User not found!'.

## Cleanup
Delete user via API.

## Automation notes
data-qa: login-email, login-password, login-button.
