# TC-008: Users API: account lifecycle and verifyLogin negatives
- Status: Ready
- Type: API
- Priority: P2
- Tags: @smoke, @regression, @api, @negative
- Automated: Yes
- Spec: tests/api/users.api.spec.ts

## Preconditions
None.

## Test data
Generated user.

## Steps
1. POST createAccount.
2. GET getUserDetailByEmail.
3. POST verifyLogin (valid).
4. DELETE deleteAccount; verifyLogin again.
5. Negatives: wrong password, missing password, DELETE on verifyLogin.

## Expected results
- create: 201 'User created!'; get: 200 with matching email/name; verify: 200 'User exists!'.
- delete: 200 'Account deleted!'; verify afterwards: 404.
- Wrong password: 404; missing param: 400; DELETE method: 405.

## Cleanup
Account deleted within the test.

## Automation notes
Form-encoded bodies.
