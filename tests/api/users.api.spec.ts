import { test, expect } from '../../src/fixtures';
import { MESSAGES, RESPONSE_CODE } from '../../src/data/constants';
import { buildUser } from '../../src/data/factory';

/**
 * Users API tests (TC-008)
 * These tests use only the `api` fixture, so no browser is opened.
 * Note: the site often returns HTTP 200 and puts the real status in the body field `responseCode`,
 * so every check below is made on `responseCode` (and `message` for the text the API returns).
 */
test.describe('Users API', () => {
  // TC-008 (positive): full account lifecycle: create -> fetch -> verify login -> delete -> verify gone
  test(
    'API | Create, fetch, verify and delete an account | TC-008',
    { tag: ['@smoke', '@regression', '@api'] },
    async ({ api }) => {
      // Link this test to its manual test case (shows up in the reports)
      test.info().annotations.push({ type: 'TC', description: 'TC-008' });

      // Unique test data for this run, so parallel tests never share an account
      const user = buildUser();

      try {
        // Step 1: create the account. The API answers 201 with "User created!"
        const created = await api.users.create(user);
        expect(created.responseCode, 'create responseCode').toBe(RESPONSE_CODE.created);
        expect(created.message).toBe(MESSAGES.userCreated);

        // Step 2: fetch the account by email and check the stored details match what we sent
        const fetched = await api.users.getByEmail(user.email);
        expect(fetched.responseCode, 'get responseCode').toBe(RESPONSE_CODE.ok);
        expect(fetched.data.user.email).toBe(user.email);
        expect(fetched.data.user.name).toBe(user.name);

        // Step 3: the new credentials are accepted ("User exists!")
        const verified = await api.users.verifyLogin(user.email, user.password);
        expect(verified.responseCode, 'verify responseCode').toBe(RESPONSE_CODE.ok);
        expect(verified.message).toBe(MESSAGES.userExists);
      } finally {
        // Cleanup always runs, even if an assertion above fails, so no test account is left behind
        const deleted = await api.users.delete(user.email, user.password);
        expect(deleted.responseCode, 'delete responseCode').toBe(RESPONSE_CODE.ok);
        expect(deleted.message).toBe(MESSAGES.accountDeleted);
      }

      // Step 4: after deletion the same credentials must no longer be accepted (404)
      const after = await api.users.verifyLogin(user.email, user.password);
      expect(after.responseCode, 'verify after delete').toBe(RESPONSE_CODE.notFound);
    },
  );

  // TC-008 (negative): invalid or unsupported verifyLogin requests are rejected
  test(
    'API | verifyLogin negative cases | TC-008',
    { tag: ['@regression', '@api', '@negative'] },
    async ({ api, registeredUser }) => {
      test.info().annotations.push({ type: 'TC', description: 'TC-008' });

      // `registeredUser` is an account created through the API by the fixture and
      // deleted automatically after the test, so this test needs no cleanup code.

      // Case 1: correct email, wrong password -> 404 "User not found!"
      const wrong = await api.users.verifyLogin(registeredUser.email, 'not-the-password');
      expect(wrong.responseCode, 'wrong password').toBe(RESPONSE_CODE.notFound);
      expect(wrong.message).toBe(MESSAGES.userNotFound);

      // Case 2: the password parameter is missing -> 400 "Bad request, ..."
      const missing = await api.users.verifyLoginRaw({ email: registeredUser.email });
      expect(missing.responseCode, 'missing password').toBe(RESPONSE_CODE.badRequest);
      expect(missing.message).toBe(MESSAGES.loginParamMissing);

      // Case 3: verifyLogin only supports POST, so a DELETE request -> 405 "not supported"
      const unsupported = await api.users.verifyLoginWithDelete();
      expect(unsupported.responseCode, 'DELETE method').toBe(RESPONSE_CODE.methodNotAllowed);
      expect(unsupported.message).toBe(MESSAGES.methodNotSupported);
    },
  );
});