import { test, expect } from '../../src/fixtures';
import { buildUser } from '../../src/data/factory';
import { RESPONSE_CODE } from '../../src/data/constants';

/**
 * Registration test (TC-001)
 * Hybrid flow (UI -> API): the account is created through the browser signup form,
 * then the API is used to confirm the account was really saved with the right details.
 */
test.describe('Registration', () => {
  // TC-001 (positive): a new user registers in the UI and the account exists in the backend
  test(
    'Hybrid | Register user via UI and verify account via API | TC-001',
    { tag: ['@smoke', '@hybrid'] },
    async ({ pages, api }) => {
      // Link this test to its manual test case (shows up in the reports)
      test.info().annotations.push({ type: 'TC', description: 'TC-001' });

      // Unique test data for this run (name, email, address...), so parallel tests never clash
      const user = buildUser();

      // try/finally: the account is created by the UI here (not by a fixture),
      // so the test must delete it itself, even if an assertion fails
      try {
        // Step 1: start the signup from the home page
        await test.step('Open login page and start signup', async () => {
          await pages.home.open();
          const login = await pages.home.goToLogin();
          // The "New User Signup!" form must be visible
          await expect(login.signupHeading).toBeVisible();
          // Enter the name and email, then move to the account details form
          const signup = await login.startSignup(user.name, user.email);
          await expect(signup.heading).toBeVisible();

          // Step 2: fill in the full account form and submit it
          await test.step('Fill account information and create account', async () => {
            const created = await signup.fillAndSubmit(user);
            // The "Account Created!" page proves the form was accepted
            await expect(created.heading).toContainText(/account created/i);
            await created.continue();
          });
        });

        // Step 3: after signup the user is logged in automatically
        await test.step('Verify logged-in state in UI', async () => {
          await expect(pages.home.loggedInAs).toContainText(user.name);
          await expect(pages.home.logoutLink).toBeVisible();
        });

        // Step 4: ask the API for the account and compare it with the data we typed in the UI.
        // This proves the data was saved correctly, not just shown on screen.
        await test.step('Verify persisted account via API', async () => {
          const res = await api.users.getByEmail(user.email);
          // The site can return HTTP 200 with the real status in the body, so check both
          expect(res.httpStatus, 'HTTP status').toBe(200);
          expect(res.responseCode, 'responseCode').toBe(RESPONSE_CODE.ok);
          expect(res.data.user.email).toBe(user.email);
          expect(res.data.user.name).toBe(user.name);
          expect(res.data.user.first_name).toBe(user.firstname);
          expect(res.data.user.city).toBe(user.city);
        });
      } finally {
        // Cleanup always runs, even when the test fails, so no test account is left behind
        await test.step('Cleanup: delete account via API', async () => {
          const deleted = await api.users.delete(user.email, user.password);
          expect(deleted.responseCode, 'deleteAccount responseCode').toBe(RESPONSE_CODE.ok);
          expect(deleted.message).toBe('Account deleted!');
        });
      }
    },
  );
});