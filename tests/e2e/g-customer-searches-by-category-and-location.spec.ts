import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { CustomerAccountPage } from '../pages/CustomerAccountPage';
import { CategoryLocationSearchResultsPage } from '../pages/CategoryLocationSearchResultsPage';

/**
 * Customer Searches For Businesses By Category And Location
 *
 * Manual Test Case: NCB-6_CustomerSearchesForBusinessesByCategoryAndLocation
 *
 * Test Steps:
 * 1. Navigate to https://staging.nocowboys.co.nz (HTTP auth from .env)
 * 2. Click Login button
 * 3. Enter CUSTOMER_LOGIN_TEST_LOGIN in email field
 * 4. Enter CUSTOMER_LOGIN_TEST_PASSWORD in password field
 * 5. Click Log in button
 * 6. Verify customer dashboard: URL /customers/account, h1 matches CUSTOMER_LOGIN_TEST_FULL_NAME
 * 7. Click logo – home page loads
 * 8. Click button "Find a business" – з'являються поля вводу категорії та локації
 * 9. У поле "Help me find" ввести "Academic" – з'являється випадаючий список категорій
 * 10. Обрати "Academic" з випадаючого списку – з'являється поле "in or around"
 * 11. У поле "in or around" ввести "Wellington CBD" – з'являється випадаючий список локацій
 * 12. Обрати "Wellington CBD" – кнопка "Find Top Matches" стає клікабельною
 * 13. Клікнути "Find Top Matches" – відкривається сторінка пошуку бізнесів по категорії та локації
 * 14. Фінальні перевірки на сторінці результатів: URL, категорія, локація, результати (Academic, ≤150км)
 */
test.describe('Customer Searches For Businesses By Category And Location', () => {
  test('NCB-6_CustomerSearchesForBusinessesByCategoryAndLocation - should login, search by category and location, and verify results', async ({
    page,
  }) => {
    // Arrange
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const customerAccountPage = new CustomerAccountPage(page);
    const categoryLocationSearchPage = new CategoryLocationSearchResultsPage(page);

    const customerEmail = process.env.CUSTOMER_LOGIN_TEST_LOGIN;
    const customerPassword = process.env.CUSTOMER_LOGIN_TEST_PASSWORD;
    const expectedCustomerName = process.env.CUSTOMER_LOGIN_TEST_FULL_NAME;

    const categorySearch = 'Academic';
    const locationSearch = 'Wellington CBD';
    const expectedSearchPath = /\/search\/wellington-cbd\/academic/i;

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

    // Act – Step 7: Click logo, home page loads
    await homePage.clickLogo();
    await expect(page).toHaveURL(/\/$/);

    // Act – Step 8: Клікнути кнопку "Find a business" – з'являються поля категорії та локації
    await homePage.clickFindABusiness();
    await page.waitForTimeout(500);
    await homePage.waitForFindBusinessPanel();

    // Act – Step 9: Ввести "Academic" у поле "Help me find"
    await homePage.typeCategory(categorySearch);
    await page.waitForTimeout(800);

    // Assert – Step 9: Dropdown with categories appears (option attached)
    const categoryOption = page.locator('.selectize-dropdown .option, .selectize-dropdown [data-selectable]').filter({ hasText: new RegExp(`^${categorySearch}$`, 'i') }).first();
    await categoryOption.waitFor({ state: 'attached', timeout: 8000 });

    // Act – Step 10: Select "Academic" from dropdown
    await homePage.selectSelectizeOption(categorySearch);
    await page.waitForTimeout(500);

    // Assert – Step 10 expected: "in or around" field appears after category selected (attached; may be "hidden" per Playwright)
    await expect(homePage.locationSelectizeInput).toBeAttached();

    // Act – Step 11: Type "Wellington CBD" in "in or around"
    await homePage.typeLocation(locationSearch);
    await page.waitForTimeout(800);

    // Assert – Step 11: Dropdown with locations appears (option attached)
    const locationOption = page.locator('.selectize-dropdown .option, .selectize-dropdown [data-selectable]').filter({ hasText: new RegExp(`^${locationSearch}$`, 'i') }).first();
    await locationOption.waitFor({ state: 'attached', timeout: 8000 });

    // Act – Step 12: Select "Wellington CBD" from dropdown
    await homePage.selectSelectizeOption(locationSearch);

    // Assert – Step 12: Кнопка "Find Top Matches" стає клікабельною
    await expect(homePage.findTopMatchesButton).toBeEnabled();

    // Act – Step 13: Клікнути "Find Top Matches" – відкривається сторінка пошуку по категорії та локації
    await Promise.all([
      page.waitForURL(expectedSearchPath, { timeout: 15000 }),
      homePage.clickFindTopMatches(),
    ]);

    // Act – Step 14: Дочекатися завантаження сторінки результатів пошуку по категорії та локації
    await categoryLocationSearchPage.waitForPageLoad();

    // Assert – Step 14 (фінальні перевірки): URL сторінки результатів
    await expect(page).toHaveURL(expectedSearchPath);

    // Assert – Step 14: У полях категорії та локації відображаються введені значення
    const displayedCategory = await categoryLocationSearchPage.getCategoryDisplayValue();
    expect(displayedCategory?.trim()).toContain(categorySearch);

    const displayedLocation = await categoryLocationSearchPage.getLocationDisplayValue();
    expect(displayedLocation?.trim().toLowerCase()).toContain(
      locationSearch.toLowerCase().replace(/\s+/g, ' ')
    );

    // Assert – Step 14: У результатах – тільки бізнеси з категорією Academic та відстанню не більше 150км
    const businessResults = categoryLocationSearchPage.getAllBusinessResults();
    const count = await businessResults.count();
    expect(count).toBeGreaterThan(0);

    const resultsList = categoryLocationSearchPage.getBusinessResultsList();
    await expect(resultsList).toBeVisible();

    const maxDistanceKm = 150;
    const distanceRegex = /\(?([\d.]+)\s*kms?\)?/i;

    for (let i = 0; i < count; i++) {
      const item = businessResults.nth(i);
      const text = (await item.textContent()) ?? '';
      expect(text.toLowerCase()).toContain(categorySearch.toLowerCase());
      const distanceMatch = text.match(distanceRegex);
      if (distanceMatch) {
        const distanceKm = parseFloat(distanceMatch[1]);
        expect(distanceKm).toBeLessThanOrEqual(maxDistanceKm);
      }
    }
  });
});
