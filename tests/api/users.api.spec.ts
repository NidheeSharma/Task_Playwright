import { test, expect } from '../../src/fixtures';
import { MESSAGES, RESPONSE_CODE } from '../../src/data/constants';
import { buildUser } from '../../src/data/factory';

test.describe('Users API', () => {
  test(
    'API | Create, fetch, verify and delete an account | TC-008',
    { tag: ['@smoke', '@regression', '@api'] },
    async ({ api }) => {
      test.info().annotations.push({ type: 'TC', description: 'TC-008' });
      const user = buildUser();
      try {
        const created = await api.users.create(user);
        expect(created.responseCode, 'create responseCode').toBe(RESPONSE_CODE.created);
        expect(created.message).toBe(MESSAGES.userCreated);

        const fetched = await api.users.getByEmail(user.email);
        expect(fetched.responseCode, 'get responseCode').toBe(RESPONSE_CODE.ok);
        expect(fetched.data.user.email).toBe(user.email);
        expect(fetched.data.user.name).toBe(user.name);

        const verified = await api.users.verifyLogin(user.email, user.password);
        expect(verified.responseCode, 'verify responseCode').toBe(RESPONSE_CODE.ok);
        expect(verified.message).toBe(MESSAGES.userExists);
      } finally {
        const deleted = await api.users.delete(user.email, user.password);
        expect(deleted.responseCode, 'delete responseCode').toBe(RESPONSE_CODE.ok);
        expect(deleted.message).toBe(MESSAGES.accountDeleted);
      }
      const after = await api.users.verifyLogin(user.email, user.password);
      expect(after.responseCode, 'verify after delete').toBe(RESPONSE_CODE.notFound);
    },
  );

  test(
    'API | verifyLogin negative cases | TC-008',
    { tag: ['@regression', '@api', '@negative'] },
    async ({ api, registeredUser }) => {
      test.info().annotations.push({ type: 'TC', description: 'TC-008' });

      const wrong = await api.users.verifyLogin(registeredUser.email, 'not-the-password');
      expect(wrong.responseCode, 'wrong password').toBe(RESPONSE_CODE.notFound);
      expect(wrong.message).toBe(MESSAGES.userNotFound);

      const missing = await api.users.verifyLoginRaw({ email: registeredUser.email });
      expect(missing.responseCode, 'missing password').toBe(RESPONSE_CODE.badRequest);
      expect(missing.message).toBe(MESSAGES.loginParamMissing);

      const unsupported = await api.users.verifyLoginWithDelete();
      expect(unsupported.responseCode, 'DELETE method').toBe(RESPONSE_CODE.methodNotAllowed);
      expect(unsupported.message).toBe(MESSAGES.methodNotSupported);
    },
  );
});
