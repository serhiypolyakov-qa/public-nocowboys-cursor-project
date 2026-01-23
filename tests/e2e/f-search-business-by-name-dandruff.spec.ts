import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { CustomerAccountPage } from '../pages/CustomerAccountPage';
import { SearchResultsPage } from '../pages/SearchResultsPage';

/**
 * Customer searches for businesses by name using Dandruff button Test
 * 
 * Manual Test Case: NCB-5-Customer searches for businesses by name using Dandruff button
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
 * 7. Клікнути на кнопку Dandruff
 * 8. У поле пошуку ввести пошуковий запит "Greenice Web Development"
 * 9. Expected result: після невеликої паузи у випадаючому списку результатів пошуку відображається бізнес Greenice Web Development
 * 10. Клікнути кнопку на клавіатурі Enter
 * 11. Expected Result:
 *     а. Відкрилась сторінка пошуку бізнесів по назві https://staging.nocowboys.co.nz/search-business/greenice+web+development, на якій відображається поле вводу пошуку, в якому вже введено наш пошуковий запит "Greenice Web Development"
 *     b. У результатах пошуку відображається бізнес з назвою "Greenice Web Development"
 */
test.describe('Customer searches for businesses by name using Dandruff button', () => {
  test('NCB-5-Customer searches for businesses by name using Dandruff button - should successfully search for business using Dandruff button', async ({ page }) => {
    // Arrange
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const customerAccountPage = new CustomerAccountPage(page);
    const searchResultsPage = new SearchResultsPage(page);
    
    // Get credentials from environment variables
    const customerEmail = process.env.CUSTOMER_LOGIN_TEST_LOGIN;
    const customerPassword = process.env.CUSTOMER_LOGIN_TEST_PASSWORD;
    const expectedCustomerName = process.env.CUSTOMER_LOGIN_TEST_FULL_NAME;
    const searchQuery = 'Greenice Web Development';

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

    // Act - Step 7: Click on Dandruff button
    await customerAccountPage.clickDandruffSearchButton();

    // Wait for search input to appear
    await customerAccountPage.searchInput.waitFor({ state: 'visible', timeout: 5000 });

    // Act - Step 8: Enter search query "Greenice Web Development" in search field
    await customerAccountPage.enterSearchQuery(searchQuery);

    // Wait a short pause for dropdown results to appear (as per step 9 requirement)
    await page.waitForTimeout(1000);

    // Act - Step 9: Wait for dropdown results to appear
    await customerAccountPage.waitForDropdownResults();

    // Assert - Step 9: Verify that dropdown shows business "Greenice Web Development"
    const dropdownResults = customerAccountPage.getDropdownResults();
    const dropdownResultsCount = await dropdownResults.count();
    
    expect(dropdownResultsCount).toBeGreaterThan(0);
    
    // Find the business in dropdown results
    let foundBusiness = false;
    for (let i = 0; i < dropdownResultsCount; i++) {
      const resultItem = dropdownResults.nth(i);
      const businessName = await customerAccountPage.getBusinessNameFromDropdown(resultItem);
      if (businessName?.includes('Greenice Web Development')) {
        foundBusiness = true;
        break;
      }
    }
    expect(foundBusiness).toBe(true);

    // Act - Step 10: Press Enter key
    await Promise.all([
      page.waitForURL(/.*\/search-business\/.*/, { timeout: 15000 }),
      customerAccountPage.pressEnterInSearch()
    ]);

    // Act - Step 11: Wait for search results page to load
    await searchResultsPage.waitForPageLoad();

    // Assert - Step 11a: Verify that search results page URL contains /search-business/greenice+web+development
    const currentUrl = page.url().toLowerCase();
    expect(currentUrl).toContain('/search-business/');
    expect(currentUrl).toContain('greenice');
    expect(currentUrl).toContain('web');
    expect(currentUrl).toContain('development');

    // Assert - Step 11a: Verify that search input is visible and contains the search query
    const isSearchInputVisible = await searchResultsPage.isSearchInputVisible();
    expect(isSearchInputVisible).toBe(true);
    
    const searchInputValue = await searchResultsPage.getSearchInputValue();
    expect(searchInputValue?.toLowerCase()).toContain('greenice web development'.toLowerCase());

    // Assert - Step 11b: Verify that search results display business "Greenice Web Development"
    const businessResults = searchResultsPage.getAllBusinessResults();
    const businessResultsCount = await businessResults.count();
    
    expect(businessResultsCount).toBeGreaterThan(0);
    
    // Find the business in search results
    let foundBusinessInResults = false;
    for (let i = 0; i < businessResultsCount; i++) {
      const businessItem = businessResults.nth(i);
      const businessNameText = await searchResultsPage.getBusinessNameText(businessItem);
      if (businessNameText?.includes('Greenice Web Development')) {
        foundBusinessInResults = true;
        break;
      }
    }
    expect(foundBusinessInResults).toBe(true);
  });
});
