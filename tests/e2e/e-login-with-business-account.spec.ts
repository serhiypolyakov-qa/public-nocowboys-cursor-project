import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { BusinessDashboardPage } from '../pages/BusinessDashboardPage';

/**
 * Login with Business Account Test
 * 
 * Manual Test Case: NCB-4-LoginWithBusinessAccount
 * 
 * Test Steps:
 * 1. Перейди на https://staging.nocowboys.co.nz (for base Authorization use HTTP_AUTH_USERNAME and HTTP_AUTH_PASSWORD from .env)
 * 2. Клікнути на кнопку Login
 * 3. У поле Login ввести значення з BUSINESS_LOGIN_TEST_LOGIN з файлу .env
 * 4. У поле Password ввести значення з BUSINESS_LOGIN_TEST_PASSWORD з файлу .env
 * 5. Клікнути на кнопку Log in
 * 6. Після завантаження сторінки переконатись, що відкрилась сторінка дашборду бізнеса.
 *    Expected result:
 *    a. Завантажилась сторінка https://staging.nocowboys.co.nz/business
 *    b. На сторінці відображається назва бізнеса, яка має бути як значення з BUSINESS_LOGIN_TEST_BUSINESS_NAME з файлу .env
 *    c. На сторінці відображається таб Dashboard
 */
test.describe('Login with Business Account', () => {
  test('NCB-4-LoginWithBusinessAccount - should successfully login with business account and verify dashboard', async ({ page }) => {
    // Arrange
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const dashboardPage = new BusinessDashboardPage(page);
    
    // Get credentials from environment variables
    const businessEmail = process.env.BUSINESS_LOGIN_TEST_LOGIN;
    const businessPassword = process.env.BUSINESS_LOGIN_TEST_PASSWORD;
    const expectedBusinessName = process.env.BUSINESS_LOGIN_TEST_BUSINESS_NAME;

    // Validate that required environment variables are set
    if (!businessEmail || !businessPassword || !expectedBusinessName) {
      throw new Error('Missing required environment variables: BUSINESS_LOGIN_TEST_LOGIN, BUSINESS_LOGIN_TEST_PASSWORD, or BUSINESS_LOGIN_TEST_BUSINESS_NAME');
    }

    // Act - Step 1: Navigate to staging.nocowboys.co.nz (HTTP auth configured in playwright.config.ts)
    await homePage.goto();

    // Act - Step 2: Click on Login button
    await homePage.clickLogin();

    // Wait for login page to load
    await loginPage.emailInput.waitFor({ state: 'visible', timeout: 10000 });

    // Act - Step 3: Enter email from BUSINESS_LOGIN_TEST_LOGIN
    await loginPage.enterEmail(businessEmail);

    // Act - Step 4: Enter password from BUSINESS_LOGIN_TEST_PASSWORD
    await loginPage.enterPassword(businessPassword);

    // Act - Step 5: Click on Log in button and wait for navigation
    await Promise.all([
      page.waitForURL(/.*\/business/, { timeout: 15000 }),
      loginPage.clickLoginSubmit()
    ]);

    // Act - Step 6: Wait for business dashboard page to fully load
    await dashboardPage.waitForPageLoad();

    // Assert - Step 6a: Verify that page URL is https://staging.nocowboys.co.nz/business
    await expect(page).toHaveURL(/.*\/business/);

    // Assert - Step 6b: Verify that business name is displayed and matches BUSINESS_LOGIN_TEST_BUSINESS_NAME
    const actualBusinessName = await dashboardPage.getBusinessName();
    expect(actualBusinessName).toBeTruthy();
    expect(actualBusinessName?.trim()).toBe(expectedBusinessName.trim());

    // Assert - Step 6c: Verify that Dashboard tab is displayed
    const isDashboardTabVisible = await dashboardPage.isDashboardTabVisible();
    expect(isDashboardTabVisible).toBe(true);
  });
});
