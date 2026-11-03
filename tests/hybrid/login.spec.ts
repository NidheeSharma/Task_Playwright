import { test, expect } from '../../src/fixtures';
import { MESSAGES, RESPONSE_CODE } from '../../src/data/constants';

/**
 * Login tests (TC-002)
 * Hybrid flow: the account is created through the API by the `registeredUser` fixture,
 * then login is performed and verified in the browser, with the API used as a second check.
 * The fixture deletes the account automatically after each test, so no cleanup code is needed here.
 */
test.describe('Login', () => {
  // TC-002 (positive): valid credentials log the user in, and logout ends the session
  test(
    'Hybrid | Login with valid credentials and logout | TC-002',
    { tag: ['@smoke', '@regression', '@hybrid'] },
    // `page` is the raw browser page (used for the URL check); `pages` holds the page objects
    async ({ page, pages, api, registeredUser }) => {
      // Link this test to its manual test case (shows up in the reports)
      test.info().annotations.push({ type: 'TC', description: 'TC-002' });

      // Step 1: confirm through the API that the account really exists before using the UI.
      // If this fails, we know the problem is in the setup and not in the UI login.
      await test.step('API confirms the user exists', async () => {
        const res = await api.users.verifyLogin(registeredUser.email, registeredUser.password);
        expect(res.responseCode, 'responseCode').toBe(RESPONSE_CODE.ok);
        expect(res.message).toBe(MESSAGES.userExists);
      });

      // Step 2: open the login page and sign in with the API-created account
      await test.step('Log in through the UI', async () => {
        await pages.login.open();
        await expect(pages.login.loginHeading).toBeVisible();
        await pages.login.login(registeredUser.email, registeredUser.password);
      });

      // Step 3: the header shows the user's name and a Logout link, which proves the session started
      await test.step('Verify logged-in state', async () => {
        await expect(pages.home.loggedInAs).toContainText(registeredUser.name);
        await expect(pages.home.logoutLink).toBeVisible();
      });

      // Step 4: log out and check that we are back on the login page with no active session
      await test.step('Logout and verify login page', async () => {
        const login = await pages.home.logout();
        await expect(login.loginHeading).toBeVisible();
        await expect(page).toHaveURL(/\/login/);
        // The "Logged in as" text must be gone
        await expect(pages.home.loggedInAs).toHaveCount(0);
      });
    },
  );

  // TC-002 (negative): a wrong password is rejected, both in the UI and by the API
  test(
    'Hybrid | Login with wrong password is rejected in UI and API | TC-002',
    { tag: ['@regression', '@hybrid', '@negative'] },
    async ({ pages, api, registeredUser }) => {
      test.info().annotations.push({ type: 'TC', description: 'TC-002' });

      // A password that is guaranteed to be wrong for this account
      const wrongPassword = `${registeredUser.password}_wrong`;

      // Step 1: try to log in through the UI with the wrong password
      await test.step('Submit wrong password in the UI', async () => {
        await pages.login.open();
        await pages.login.login(registeredUser.email, wrongPassword);
      });

      // Step 2: the UI shows the error message and no session is created
      await test.step('Verify UI error and no session', async () => {
        await expect(pages.login.loginError).toBeVisible();
        await expect(pages.home.loggedInAs).toHaveCount(0);
      });

      // Step 3: the API rejects the same credentials with 404 "User not found!",
      // which confirms the UI and the API agree
      await test.step('API rejects the same credentials', async () => {
        const res = await api.users.verifyLogin(registeredUser.email, wrongPassword);
        expect(res.responseCode, 'responseCode').toBe(RESPONSE_CODE.notFound);
        expect(res.message).toBe(MESSAGES.userNotFound);
      });
    },
  );
});