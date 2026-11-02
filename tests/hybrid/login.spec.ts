import { test, expect } from '../../src/fixtures';
import { MESSAGES, RESPONSE_CODE } from '../../src/data/constants';

test.describe('Login', () => {
  test(
    'Hybrid | Login with valid credentials and logout | TC-002',
    { tag: ['@smoke', '@regression', '@hybrid'] },
    async ({ page, pages, api, registeredUser }) => {
      test.info().annotations.push({ type: 'TC', description: 'TC-002' });

      await test.step('API confirms the user exists', async () => {
        const res = await api.users.verifyLogin(registeredUser.email, registeredUser.password);
        expect(res.responseCode, 'responseCode').toBe(RESPONSE_CODE.ok);
        expect(res.message).toBe(MESSAGES.userExists);
      });

      await test.step('Log in through the UI', async () => {
        await pages.login.open();
        await expect(pages.login.loginHeading).toBeVisible();
        await pages.login.login(registeredUser.email, registeredUser.password);
      });

      await test.step('Verify logged-in state', async () => {
        await expect(pages.home.loggedInAs).toContainText(registeredUser.name);
        await expect(pages.home.logoutLink).toBeVisible();
      });

      await test.step('Logout and verify login page', async () => {
        const login = await pages.home.logout();
        await expect(login.loginHeading).toBeVisible();
        await expect(page).toHaveURL(/\/login/);
        await expect(pages.home.loggedInAs).toHaveCount(0);
      });
    },
  );

  test(
    'Hybrid | Login with wrong password is rejected in UI and API | TC-002',
    { tag: ['@regression', '@hybrid', '@negative'] },
    async ({ pages, api, registeredUser }) => {
      test.info().annotations.push({ type: 'TC', description: 'TC-002' });
      const wrongPassword = `${registeredUser.password}_wrong`;

      await test.step('Submit wrong password in the UI', async () => {
        await pages.login.open();
        await pages.login.login(registeredUser.email, wrongPassword);
      });

      await test.step('Verify UI error and no session', async () => {
        await expect(pages.login.loginError).toBeVisible();
        await expect(pages.home.loggedInAs).toHaveCount(0);
      });

      await test.step('API rejects the same credentials', async () => {
        const res = await api.users.verifyLogin(registeredUser.email, wrongPassword);
        expect(res.responseCode, 'responseCode').toBe(RESPONSE_CODE.notFound);
        expect(res.message).toBe(MESSAGES.userNotFound);
      });
    },
  );
});
