import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { CustomerAccountPage } from '../pages/CustomerAccountPage';
import { CustomerRatingsPage } from '../pages/CustomerRatingsPage';
import { CustomerFavouritesPage } from '../pages/CustomerFavouritesPage';
import { CustomerSharedFavouritesPage } from '../pages/CustomerSharedFavouritesPage';
import { CustomerSavedSearchesPage } from '../pages/CustomerSavedSearchesPage';
import { CustomerConversationsPage } from '../pages/CustomerConversationsPage';
import { CustomerAccountSettingsPage } from '../pages/CustomerAccountSettingsPage';
import { CustomerPasswordPage } from '../pages/CustomerPasswordPage';
import { CustomerSubscriptionPreferencesPage } from '../pages/CustomerSubscriptionPreferencesPage';
import { CustomerBlacklistedBusinessesPage } from '../pages/CustomerBlacklistedBusinessesPage';

/**
 * Customer Visits All Pages Of Dashboard
 *
 * Manual Test Case: NCB-10-CustomerVisitsAllPagesOfDashboard
 *
 * Test Steps:
 * 1. Navigate to https://staging.nocowboys.co.nz (HTTP auth from .env) and maximize browser window
 * 2. Click Login button
 * 3. Enter CUSTOMER_LOGIN_TEST_LOGIN in email field
 * 4. Enter CUSTOMER_LOGIN_TEST_PASSWORD in password field
 * 5. Click Log in button
 * 6. Verify customer dashboard Jobs page loads correctly
 * 7. Click on Ratings tab and verify page loads
 * 8. Click on Favourites tab and verify page loads
 * 9. Click on Shared Favourites tab and verify page loads
 * 10. Click on Saved Searches tab and verify page loads
 * 11. Click on Conversations tab and verify page loads
 * 12. Click on Account Settings tab and verify page loads
 * 13. Click on Password tab within Account Settings and verify page loads
 * 14. Click on Subscription Preferences tab and verify page loads
 * 15. Click on "..." dropdown menu
 * 16. Click on Blacklisted Businesses tab and verify page loads
 */
test.describe('Customer Visits All Pages Of Dashboard', () => {
  test('NCB-10-CustomerVisitsAllPagesOfDashboard - should navigate through all dashboard tabs and verify each page', async ({
    page,
  }) => {
    // Arrange
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const customerAccountPage = new CustomerAccountPage(page);
    const customerRatingsPage = new CustomerRatingsPage(page);
    const customerFavouritesPage = new CustomerFavouritesPage(page);
    const customerSharedFavouritesPage = new CustomerSharedFavouritesPage(page);
    const customerSavedSearchesPage = new CustomerSavedSearchesPage(page);
    const customerConversationsPage = new CustomerConversationsPage(page);
    const customerAccountSettingsPage = new CustomerAccountSettingsPage(page);
    const customerPasswordPage = new CustomerPasswordPage(page);
    const customerSubscriptionPreferencesPage = new CustomerSubscriptionPreferencesPage(page);
    const customerBlacklistedBusinessesPage = new CustomerBlacklistedBusinessesPage(page);

    const customerEmail = process.env.CUSTOMER_LOGIN_TEST_LOGIN;
    const customerPassword = process.env.CUSTOMER_LOGIN_TEST_PASSWORD;
    const expectedCustomerName = process.env.CUSTOMER_LOGIN_TEST_FULL_NAME;

    if (!customerEmail || !customerPassword || !expectedCustomerName) {
      throw new Error(
        'Missing required environment variables: CUSTOMER_LOGIN_TEST_LOGIN, CUSTOMER_LOGIN_TEST_PASSWORD, or CUSTOMER_LOGIN_TEST_FULL_NAME'
      );
    }

    // Act – Step 1: Navigate to staging (HTTP auth in playwright.config.ts) and maximize window
    await homePage.goto();
    await page.setViewportSize({ width: 1920, height: 1080 });

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

    // Assert – Step 6c: Active Jobs section heading contains "Active Jobs"
    await expect(customerAccountPage.activeJobsSection).toBeVisible();
    const activeJobsHeading = await customerAccountPage.activeJobsSection.textContent();
    expect(activeJobsHeading?.trim()).toContain('Active Jobs');

    // Assert – Step 6d: "Post a new job" button is displayed
    await expect(customerAccountPage.postNewJobButton).toBeVisible();

    // Act – Step 7: Click on Ratings tab
    await customerAccountPage.clickRatingsTab();
    await customerRatingsPage.waitForPageLoad();

    // Assert – Step 7a: Ratings page URL
    await expect(page).toHaveURL(/.*\/customers\/ratings/);

    // Assert – Step 7b: "Rate a Business" button is displayed
    await expect(customerRatingsPage.rateBusinessButton).toBeVisible();

    // Assert – Step 7c: Ratings heading contains "Ratings"
    await expect(customerRatingsPage.ratingsHeading).toBeVisible();
    const ratingsHeadingText = await customerRatingsPage.ratingsHeading.textContent();
    expect(ratingsHeadingText?.trim()).toContain('Ratings');

    // Act – Step 8: Click on Favourites tab
    await customerAccountPage.clickFavouritesTab();
    await customerFavouritesPage.waitForPageLoad();

    // Assert – Step 8a: Favourites page URL
    await expect(page).toHaveURL(/.*\/customers\/account\/favourites/);

    // Assert – Step 8b: "Add a favourite business" button is displayed
    await expect(customerFavouritesPage.addFavouriteBusinessButton).toBeVisible();

    // Assert – Step 8c: "Share favourites" button is displayed
    await expect(customerFavouritesPage.shareFavouritesButton).toBeVisible();

    // Assert – Step 8d: Favourites heading contains "Favourites"
    await expect(customerFavouritesPage.favouritesHeading).toBeVisible();
    const favouritesHeadingText = await customerFavouritesPage.favouritesHeading.textContent();
    expect(favouritesHeadingText?.trim()).toContain('Favourites');

    // Act – Step 9: Click on Shared Favourites tab
    await customerAccountPage.clickSharedFavouritesTab();
    await customerSharedFavouritesPage.waitForPageLoad();

    // Assert – Step 9a: Shared Favourites page URL
    await expect(page).toHaveURL(/.*\/customers\/account\/shared-favourites/);

    // Assert – Step 9b: Shared Favourites heading contains "Shared Favourites"
    await expect(customerSharedFavouritesPage.sharedFavouritesHeading).toBeVisible();
    const sharedFavouritesHeadingText = await customerSharedFavouritesPage.sharedFavouritesHeading.textContent();
    expect(sharedFavouritesHeadingText?.trim()).toContain('Shared Favourites');

    // Assert – Step 9c: "Save shared favourites" button is displayed
    await expect(customerSharedFavouritesPage.saveSharedFavouritesButton).toBeVisible();

    // Act – Step 10: Click on Saved Searches tab
    await customerAccountPage.clickSavedSearchesTab();
    await customerSavedSearchesPage.waitForPageLoad();

    // Assert – Step 10a: Saved Searches page URL
    await expect(page).toHaveURL(/.*\/customers\/account\/search-parameters/);

    // Assert – Step 10b: Saved Searches heading contains "Saved Searches"
    await expect(customerSavedSearchesPage.savedSearchesHeading).toBeVisible();
    const savedSearchesHeadingText = await customerSavedSearchesPage.savedSearchesHeading.textContent();
    expect(savedSearchesHeadingText?.trim()).toContain('Saved Searches');

    // Act – Step 11: Click on Conversations tab
    await customerAccountPage.clickConversationsTab();
    await customerConversationsPage.waitForPageLoad();

    // Assert – Step 11a: Conversations page URL
    await expect(page).toHaveURL(/.*\/customers\/conversations/);

    // Act – Step 12: Click on Account Settings tab
    await customerAccountPage.clickAccountSettingsTab();
    await customerAccountSettingsPage.waitForPageLoad();

    // Assert – Step 12a: Account Settings page URL
    await expect(page).toHaveURL(/.*\/customers\/account\/settings/);

    // Assert – Step 12b: Account Settings heading contains "Account Settings"
    await expect(customerAccountSettingsPage.accountSettingsHeading).toBeVisible();
    const accountSettingsHeadingText = await customerAccountSettingsPage.accountSettingsHeading.textContent();
    expect(accountSettingsHeadingText?.trim()).toContain('Account Settings');

    // Assert – Step 12c: "Contact & Address Details" tab is displayed
    await expect(customerAccountSettingsPage.contactAddressDetailsTab).toBeVisible();

    // Assert – Step 12d: "Password" tab is displayed
    await expect(customerAccountSettingsPage.passwordTab).toBeVisible();

    // Assert – Step 12e: Account Settings form is displayed
    await expect(customerAccountSettingsPage.accountSettingsForm).toBeVisible();

    // Act – Step 13: Click on Password tab within Account Settings
    await customerAccountSettingsPage.clickPasswordTab();
    await customerPasswordPage.waitForPageLoad();

    // Assert – Step 13a: Update Password page URL
    await expect(page).toHaveURL(/.*\/customers\/account\/change-password/);

    // Assert – Step 13b: Password form is displayed
    await expect(customerPasswordPage.passwordForm).toBeVisible();

    // Act – Step 14: Open "..." dropdown (Subscription Preferences is in overflow), then click tab
    await customerAccountPage.clickMoreTabsDropdown();
    await customerAccountPage.clickSubscriptionPreferencesTab();
    await customerSubscriptionPreferencesPage.waitForPageLoad();

    // Assert – Step 14a: Subscription Preferences page URL
    await expect(page).toHaveURL(/.*\/customers\/account\/subscription-preferences/);

    // Assert – Step 14b: Subscription Preferences heading contains "Subscription Preferences"
    await expect(customerSubscriptionPreferencesPage.subscriptionPreferencesHeading).toBeVisible();
    const subscriptionPreferencesHeadingText = await customerSubscriptionPreferencesPage.subscriptionPreferencesHeading.textContent();
    expect(subscriptionPreferencesHeadingText?.trim()).toContain('Subscription Preferences');

    // Act – Step 15: Open "..." dropdown to reveal hidden tabs (e.g. Blacklisted Businesses)
    await customerAccountPage.clickMoreTabsDropdown();
    // Act – Step 16: Click on Blacklisted Businesses tab
    await customerAccountPage.clickBlacklistedBusinessesTab();
    await customerBlacklistedBusinessesPage.waitForPageLoad();

    // Assert – Step 16a: Blacklisted Businesses page URL
    await expect(page).toHaveURL(/.*\/customers\/account\/blacklist-businesses/);

    // Assert – Step 16b: Blacklist heading contains "Blacklist"
    await expect(customerBlacklistedBusinessesPage.blacklistHeading).toBeVisible();
    const blacklistHeadingText = await customerBlacklistedBusinessesPage.blacklistHeading.textContent();
    expect(blacklistHeadingText?.trim()).toContain('Blacklist');

    // Wait a bit to see the final page in headed mode
    await page.waitForTimeout(1000);
  });
});
