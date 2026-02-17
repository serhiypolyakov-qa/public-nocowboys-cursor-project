import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { CustomerAccountPage } from '../pages/CustomerAccountPage';
import { CustomerAccountSettingsPage } from '../pages/CustomerAccountSettingsPage';
import { CustomerPasswordPage } from '../pages/CustomerPasswordPage';

/**
 * Customer Changes Password On My Dashboard/Account Settings/Password Page
 *
 * Test Steps:
 * 1. Navigate to https://staging.nocowboys.co.nz (HTTP auth from .env)
 * 2. Click Login button
 * 3. Enter CUSTOMER_LOGIN_TEST_LOGIN in email field
 * 4. Enter CUSTOMER_LOGIN_TEST_PASSWORD in password field
 * 5. Click Log in button
 * 6. Verify customer dashboard: URL /customers/account, h1 matches CUSTOMER_LOGIN_TEST_FULL_NAME
 * 7. Клікнути на таб дашборду Account Settings
 * 8. Клікнути на сабтаб "Password"
 * 9. У поле "Current Password" ввести CUSTOMER_LOGIN_TEST_PASSWORD
 * 10. У поле "New Password" ввести "TodayIS!123"
 * 11. У поле "Confirm New Password" ввести "TodayIS!123"
 * 12. Клікнути на кнопку "Save Changes"
 * 13. Переконатись, що вивелось повідомлення про успіх "Password updated successfully"
 * 14. Зробити ховер курсору на ім'я кастомера (DOM Path: div.main-content > header > nav.navbar navbar-default > div.container-fluid container-navbar > div#mobile-menu > ul.nav navbar-nav > li.user-menu-item dropdown > a.hidden-x > strong.user-title). Після ховеру з'явиться попап з Personal Profile меню
 * 15. Клікнути на кнопку Log out на попапі Personal Profile меню
 * 16. Enter CUSTOMER_LOGIN_TEST_LOGIN in email field
 * 17. Enter "TodayIS!123" in password field
 * 18. Click Log in button
 * 19. Verify customer dashboard: URL /customers/account, h1 matches CUSTOMER_LOGIN_TEST_FULL_NAME
 * 20. Клікнути на таб дашборду Account Settings
 * 21. Клікнути на сабтаб "Password"
 * 22. У поле "Current Password" ввести "TodayIS!123"
 * 23. У поле "New Password" ввести CUSTOMER_LOGIN_TEST_PASSWORD
 * 24. У поле "Confirm New Password" ввести CUSTOMER_LOGIN_TEST_PASSWORD
 * 25. Клікнути на кнопку "Save Changes"
 * 26. Переконатись, що вивелось повідомлення про успіх "Password updated successfully"
 */
test.describe('Customer Changes Password On My Dashboard/Account Settings/Password Page', () => {
  test('should login, navigate to Account Settings/Password page and enter new password', async ({
    page,
  }) => {
    // Arrange
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const customerAccountPage = new CustomerAccountPage(page);
    const customerAccountSettingsPage = new CustomerAccountSettingsPage(page);
    const customerPasswordPage = new CustomerPasswordPage(page);

    const customerEmail = process.env.CUSTOMER_LOGIN_TEST_LOGIN;
    const customerPassword = process.env.CUSTOMER_LOGIN_TEST_PASSWORD;
    const expectedCustomerName = process.env.CUSTOMER_LOGIN_TEST_FULL_NAME;

    const newPassword = 'TodayIS!123';

    if (!customerEmail || !customerPassword || !expectedCustomerName) {
      throw new Error(
        'Missing required environment variables: CUSTOMER_LOGIN_TEST_LOGIN, CUSTOMER_LOGIN_TEST_PASSWORD, or CUSTOMER_LOGIN_TEST_FULL_NAME'
      );
    }

    // Act – Step 1: Navigate to staging (HTTP auth in playwright.config.ts)
    await homePage.goto();

    // Act – Step 2: Click Login
    await homePage.clickLogin();
    await loginPage.emailInput.waitFor({ state: 'visible', timeout: 10000 });

    // Act – Steps 3–5: Enter credentials and submit
    await loginPage.enterEmail(customerEmail);
    await loginPage.enterPassword(customerPassword);
    await Promise.all([
      page.waitForURL(/.*\/customers\/account/, { timeout: 15000 }),
      loginPage.clickLoginSubmit(),
    ]);

    // Act – Step 6: Wait for customer dashboard
    await customerAccountPage.waitForPageLoad();

    // Assert – Step 6a: Customer account URL
    await expect(page).toHaveURL(/.*\/customers\/account/);

    // Assert – Step 6b: Customer full name matches .env
    const actualCustomerName = await customerAccountPage.getCustomerName();
    expect(actualCustomerName).toBeTruthy();
    expect(actualCustomerName?.trim()).toBe(expectedCustomerName.trim());

    // Act – Step 7: Click on Account Settings tab
    await customerAccountPage.clickAccountSettingsTab();
    await customerAccountSettingsPage.waitForPageLoad();

    // Assert – Step 7: Account Settings page URL
    await expect(page).toHaveURL(/.*\/customers\/account\/settings/);

    // Act – Step 8: Click on Password sub-tab
    await customerAccountSettingsPage.clickPasswordTab();
    await customerPasswordPage.waitForPageLoad();

    // Assert – Step 8: Password page URL
    await expect(page).toHaveURL(/.*\/customers\/account\/change-password/);

    // Act – Step 9: Enter CUSTOMER_LOGIN_TEST_PASSWORD in "Current Password" field
    await customerPasswordPage.enterCurrentPassword(customerPassword);

    // Act – Step 10: Enter "TodayIS!123" in "New Password" field
    await customerPasswordPage.enterNewPassword(newPassword);

    // Act – Step 11: Enter "TodayIS!123" in "Confirm New Password" field
    await customerPasswordPage.enterConfirmNewPassword(newPassword);

    // Act – Step 12: Click on "Save Changes" button
    await customerPasswordPage.clickSaveChanges();

    // Assert – Step 13: Verify success message "Password updated successfully" appears
    await customerPasswordPage.waitForSuccessMessage();
    await expect(customerPasswordPage.successMessage).toBeVisible();
    const successMessageText = await customerPasswordPage.successMessage.textContent();
    expect(successMessageText?.trim()).toContain('Password updated successfully');

    // Act – Step 14: Hover over customer name in header to open Personal Profile menu
    await customerAccountPage.hoverOverUserNameInHeader();

    // Act – Step 15: Click on Log out link in Personal Profile dropdown menu
    await customerAccountPage.clickLogout();

    // Assert – Step 15: Verify redirected to login page
    await expect(page).toHaveURL(/.*\/login/);

    // Act – Step 16: Enter CUSTOMER_LOGIN_TEST_LOGIN in email field
    await loginPage.enterEmail(customerEmail);

    // Act – Step 17: Enter "TodayIS!123" in password field (the new password set in step 12)
    await loginPage.enterPassword(newPassword);

    // Act – Step 18: Click Log in button and wait for navigation
    await Promise.all([
      page.waitForURL(/.*\/customers\/account/, { timeout: 15000 }),
      loginPage.clickLoginSubmit(),
    ]);

    // Act – Step 19: Wait for customer dashboard
    await customerAccountPage.waitForPageLoad();

    // Assert – Step 19a: Customer account URL
    await expect(page).toHaveURL(/.*\/customers\/account/);

    // Assert – Step 19b: Customer full name matches .env
    const actualCustomerNameAfterLogin = await customerAccountPage.getCustomerName();
    expect(actualCustomerNameAfterLogin).toBeTruthy();
    expect(actualCustomerNameAfterLogin?.trim()).toBe(expectedCustomerName.trim());

    // Act – Step 20: Click on Account Settings tab
    await customerAccountPage.clickAccountSettingsTab();
    await customerAccountSettingsPage.waitForPageLoad();

    // Assert – Step 20: Account Settings page URL
    await expect(page).toHaveURL(/.*\/customers\/account\/settings/);

    // Act – Step 21: Click on Password sub-tab
    await customerAccountSettingsPage.clickPasswordTab();
    await customerPasswordPage.waitForPageLoad();

    // Assert – Step 21: Password page URL
    await expect(page).toHaveURL(/.*\/customers\/account\/change-password/);

    // Act – Step 22: Enter "TodayIS!123" in "Current Password" field (the new password we set earlier)
    await customerPasswordPage.enterCurrentPassword(newPassword);

    // Act – Step 23: Enter CUSTOMER_LOGIN_TEST_PASSWORD in "New Password" field (restore original password)
    await customerPasswordPage.enterNewPassword(customerPassword);

    // Act – Step 24: Enter CUSTOMER_LOGIN_TEST_PASSWORD in "Confirm New Password" field
    await customerPasswordPage.enterConfirmNewPassword(customerPassword);

    // Act – Step 25: Click on "Save Changes" button
    await customerPasswordPage.clickSaveChanges();

    // Assert – Step 26: Verify success message "Password updated successfully" appears
    await customerPasswordPage.waitForSuccessMessage();
    await expect(customerPasswordPage.successMessage).toBeVisible();
    const successMessageTextAfterRestore = await customerPasswordPage.successMessage.textContent();
    expect(successMessageTextAfterRestore?.trim()).toContain('Password updated successfully');
  });
});
