import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { CustomerAccountPage } from '../pages/CustomerAccountPage';

/**
 * Login with Customer Account Test
 * 
 * Manual Test Case: NCB-3-LoginWithСustomerAccount
 * 
 * Test Steps:
 * 1. Перейди на https://staging.nocowboys.co.nz (for base Authorization use HTTP_AUTH_USERNAME and HTTP_AUTH_PASSWORD from .env)
 * 2. Клікнути на кнопку Login
 * 3. У поле Login ввести значення з CUSTOMER_LOGIN_TEST_LOGIN з файлу .env
 * 4. У поле Password ввести значення з CUSTOMER_LOGIN_TEST_PASSWORD з файлу .env
 * 5. Клікнути на кнопку Log in
 * 6. Після завантаження сторінки переконатись, що відкрилась сторінка дашборду кастомера.
 *    Expected result:
 *    a. Завантажилась сторінка https://staging.nocowboys.co.nz/customers/account
 *    b. На сторінці відображається повне ім'я кастомера, яке має бути як значення з CUSTOMER_LOGIN_TEST_FULL_NAME з файлу .env
 *    c. На сторінці відображається список Active Jobs
 */
test.describe('Login with Customer Account', () => {
  test('NCB-3-LoginWithСustomerAccount - should successfully login with customer account and verify dashboard', async ({ page }) => {
    // Arrange
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const customerAccountPage = new CustomerAccountPage(page);
    
    // Get credentials from environment variables
    const customerEmail = process.env.CUSTOMER_LOGIN_TEST_LOGIN;
    const customerPassword = process.env.CUSTOMER_LOGIN_TEST_PASSWORD;
    const expectedCustomerName = process.env.CUSTOMER_LOGIN_TEST_FULL_NAME;

    // Validate that required environment variables are set
    if (!customerEmail || !customerPassword || !expectedCustomerName) {
      throw new Error('Missing required environment variables: CUSTOMER_LOGIN_TEST_LOGIN, CUSTOMER_LOGIN_TEST_PASSWORD, or CUSTOMER_LOGIN_TEST_FULL_NAME');
    }

    // Act - Step 1: Navigate to staging.nocowboys.co.nz (HTTP auth configured in playwright.config.ts)
    await homePage.goto();

    // Act - Step 2: Click on Login button
    await homePage.clickLogin();

    // Wait for login page to load
    await loginPage.emailInput.waitFor({ state: 'visible', timeout: 10000 });

    // Act - Step 3: Enter email from CUSTOMER_LOGIN_TEST_LOGIN
    await loginPage.enterEmail(customerEmail);

    // Act - Step 4: Enter password from CUSTOMER_LOGIN_TEST_PASSWORD
    await loginPage.enterPassword(customerPassword);

    // Act - Step 5: Click on Log in button and wait for navigation
    await Promise.all([
      page.waitForURL(/.*\/customers\/account/, { timeout: 15000 }),
      loginPage.clickLoginSubmit()
    ]);

    // Act - Step 6: Wait for customer account page to fully load
    await customerAccountPage.waitForPageLoad();

    // Assert - Step 6a: Verify that page URL is https://staging.nocowboys.co.nz/customers/account
    await expect(page).toHaveURL(/.*\/customers\/account/);

    // Assert - Step 6b: Verify that customer full name is displayed and matches CUSTOMER_LOGIN_TEST_FULL_NAME
    const actualCustomerName = await customerAccountPage.getCustomerName();
    expect(actualCustomerName).toBeTruthy();
    expect(actualCustomerName?.trim()).toBe(expectedCustomerName.trim());

    // Assert - Step 6c: Verify that Active Jobs section is displayed
    const isActiveJobsVisible = await customerAccountPage.isActiveJobsSectionVisible();
    expect(isActiveJobsVisible).toBe(true);
  });
});
