import { test, expect } from '../../src/fixtures';
import { buildUser } from '../../src/data/factory';
import { RESPONSE_CODE } from '../../src/data/constants';

test.describe('Registration', () => {
  test(
    'Hybrid | Register user via UI and verify account via API | TC-001',
    { tag: ['@smoke', '@hybrid'] },
    async ({ pages, api }) => {
      test.info().annotations.push({ type: 'TC', description: 'TC-001' });
      const user = buildUser();

      try {
        await test.step('Open login page and start signup', async () => {
          await pages.home.open();
          const login = await pages.home.goToLogin();
          await expect(login.signupHeading).toBeVisible();
          const signup = await login.startSignup(user.name, user.email);
          await expect(signup.heading).toBeVisible();

          await test.step('Fill account information and create account', async () => {
            const created = await signup.fillAndSubmit(user);
            await expect(created.heading).toContainText(/account created/i);
            await created.continue();
          });
        });

        await test.step('Verify logged-in state in UI', async () => {
          await expect(pages.home.loggedInAs).toContainText(user.name);
          await expect(pages.home.logoutLink).toBeVisible();
        });

        await test.step('Verify persisted account via API', async () => {
          const res = await api.users.getByEmail(user.email);
          expect(res.httpStatus, 'HTTP status').toBe(200);
          expect(res.responseCode, 'responseCode').toBe(RESPONSE_CODE.ok);
          expect(res.data.user.email).toBe(user.email);
          expect(res.data.user.name).toBe(user.name);
          expect(res.data.user.first_name).toBe(user.firstname);
          expect(res.data.user.city).toBe(user.city);
        });
      } finally {
        await test.step('Cleanup: delete account via API', async () => {
          const deleted = await api.users.delete(user.email, user.password);
          expect(deleted.responseCode, 'deleteAccount responseCode').toBe(RESPONSE_CODE.ok);
          expect(deleted.message).toBe('Account deleted!');
        });
      }
    },
  );
});
