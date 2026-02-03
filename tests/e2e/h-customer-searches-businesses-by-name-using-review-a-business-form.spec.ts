import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { CustomerAccountPage } from '../pages/CustomerAccountPage';
import { RateBusinessPage } from '../pages/RateBusinessPage';

/**
 * Customer Searches Businesses By Name Using Review A Business Form
 *
 * Manual Test Case: NCB-7-CustomerSearchesBusinessesByNameUsingReviewABusinessForm
 *
 * Test Steps:
 * 1. Navigate to https://staging.nocowboys.co.nz (HTTP auth from .env)
 * 2. Click Login button
 * 3. Enter CUSTOMER_LOGIN_TEST_LOGIN in email field
 * 4. Enter CUSTOMER_LOGIN_TEST_PASSWORD in password field
 * 5. Click Log in button
 * 6. Verify customer dashboard: URL /customers/account, h1 matches CUSTOMER_LOGIN_TEST_FULL_NAME
 * 7. Navigate to home page https://staging.nocowboys.co.nz/
 * 8. Click "Review a business" button – search field appears
 * 9. Click in search field and type "Greenice Web Development" – autocomplete dropdown appears
 * 10. Click on "Greenice Web Development" in autocomplete dropdown – rate business page opens
 * 11. Verify rate business page: URL contains /businesses/greenice-web-development/rate, h1 shows "Rate Greenice Web Development", rating form is visible
 */
test.describe('Customer Searches Businesses By Name Using Review A Business Form', () => {
  test('NCB-7-CustomerSearchesBusinessesByNameUsingReviewABusinessForm - should login, search business by name using review form, and verify rate page', async ({
    page,
  }) => {
    // Arrange
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const customerAccountPage = new CustomerAccountPage(page);
    const rateBusinessPage = new RateBusinessPage(page);

    const customerEmail = process.env.CUSTOMER_LOGIN_TEST_LOGIN;
    const customerPassword = process.env.CUSTOMER_LOGIN_TEST_PASSWORD;
    const expectedCustomerName = process.env.CUSTOMER_LOGIN_TEST_FULL_NAME;

    const businessSearchName = 'Greenice Web Development';
    const expectedBusinessSlug = 'greenice-web-development';
    const expectedRatePagePath = /\/businesses\/greenice-web-development\/rate/i;
    const expectedRateHeading = `Rate ${businessSearchName}`;

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

    // Act – Step 7: Navigate to home page
    await homePage.goto();
    await expect(page).toHaveURL(/\/$/);

    // Act – Step 8: Click "Review a business" button – search field appears
    await homePage.clickReviewABusiness();
    await page.waitForTimeout(500);
    await homePage.waitForReviewBusinessPanel();

    // Assert – Step 8: Search field is visible
    await expect(homePage.reviewBusinessSearchInput).toBeVisible();

    // Act – Step 9: Click in search field and type "Greenice Web Development" – autocomplete dropdown appears
    await homePage.typeReviewBusinessSearch(businessSearchName);
    await page.waitForTimeout(800);

    // Assert – Step 9: Autocomplete dropdown appears with business name
    await homePage.waitForReviewBusinessAutocompleteResults();
    const autocompleteResult = homePage.reviewBusinessAutocompleteResults.filter({
      has: page.locator('span.business-name', { hasText: businessSearchName }),
    }).first();
    await expect(autocompleteResult).toBeAttached();

    // Act – Step 10: Click on "Greenice Web Development" in autocomplete dropdown – rate business page opens
    await Promise.all([
      page.waitForURL(expectedRatePagePath, { timeout: 15000 }),
      homePage.clickReviewBusinessAutocompleteResult(businessSearchName),
    ]);

    // Act – Step 11: Wait for rate business page to load
    await rateBusinessPage.waitForPageLoad();

    // Assert – Step 11a: Rate business page URL
    await expect(page).toHaveURL(expectedRatePagePath);

    // Assert – Step 11b: Rate business heading shows business name
    const actualRateHeading = await rateBusinessPage.getRateBusinessHeading();
    expect(actualRateHeading).toBeTruthy();
    expect(actualRateHeading?.trim()).toBe(expectedRateHeading.trim());

    // Assert – Step 11c: Rating form is visible
    const isFormVisible = await rateBusinessPage.isRatingFormVisible();
    expect(isFormVisible).toBe(true);

    // Wait a bit to see the final page in headed mode
    await page.waitForTimeout(2000);
  });
});
