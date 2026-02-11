import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { CustomerAccountPage } from '../pages/CustomerAccountPage';
import { PostNewJobPage } from '../pages/PostNewJobPage';

/**
 * Customer adds new job on My Dashboard/Jobs page
 *
 * Manual Test Case: NCB-11-CustomerAddsNewJobOnMyDashboardJobsPage
 *
 * Test Steps:
 * 1. Navigate to https://staging.nocowboys.co.nz (HTTP auth from .env)
 * 2. Click Login button
 * 3. Enter CUSTOMER_LOGIN_TEST_LOGIN in email field
 * 4. Enter CUSTOMER_LOGIN_TEST_PASSWORD in password field
 * 5. Click Log in button
 * 6. Verify customer dashboard: URL /customers/account, h1 matches CUSTOMER_LOGIN_TEST_FULL_NAME
 * 7. Клікнути кнопку Post a new job
 * 8. Переконатись, що відкрилась сторінка https://staging.nocowboys.co.nz/new/jobs/index/post
 * 9. На сторінці відображається форма "Post a new Job"
 * 10. Клікнути у поле Title: та ввести "Cursor Test Job from Bruno" + 5-ти значне рандомне число в кінці
 * 11. Клікнути у поле "Description:" та ввести "Cursor Test Job Description. This job was created in Cursor by the NCB-11 auto test"
 * 12. Клікнути у поле "Job Category:" та ввести "Academic"
 * 13. Переконатись, що у випадаючому списку поля "Job Category:" відображається тільки "Academic"
 * 14. У випадаючому списку поля "Job Category:" клікнути на "Academic"
 * 15. У секції "Job Location:" клікнути у поле "Choose a region" та ввести "Wellington"
 * 16. Переконатись, що у випадаючому списку поля "Choose a region" відображається тільки "Wellington Region"
 * 17. У випадаючому списку поля "Choose a region" клікнути на "Wellington Region"
 * 18. Переконатись, що поле "selectize-control AreaIDSelectize single" (Job area) стало клікабельним
 * 19. Клікнути у поле "Job area"
 * 20. У випадаючому списку поля Job area клікнути на "Porirua Area"
 * 21. Переконатись, що поле "selectize-control SuburbAreaIDSelectize single" (Job suburb) стало клікабельним
 * 22. Клікнути у поле "Job suburb"
 * 23. У випадаючому списку поля Job suburb клікнути на "Mana"
 * 24. Клікнути на кнопку "Submit"
 * 25. Переконатись, що відкрилась сторінка створеної джоби /new/jobs/index/view/id/
 * 26. Переконатись, що на у заголовку сторінки відображається назва джоби, яку вводили на кроці 10
 */
test.describe('Customer adds new job on My Dashboard/Jobs page', () => {
  test('NCB-11-CustomerAddsNewJobOnMyDashboardJobsPage - should login, open customer dashboard, navigate to Post a new Job form, and fill job details', async ({
    page,
  }) => {
    // Arrange
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const customerAccountPage = new CustomerAccountPage(page);
    const postNewJobPage = new PostNewJobPage(page);

    const customerEmail = process.env.CUSTOMER_LOGIN_TEST_LOGIN;
    const customerPassword = process.env.CUSTOMER_LOGIN_TEST_PASSWORD;
    const expectedCustomerName = process.env.CUSTOMER_LOGIN_TEST_FULL_NAME;

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

    // Act – Step 7: Клікнути кнопку Post a new job
    await Promise.all([
      page.waitForURL(/.*\/new\/jobs\/index\/post/, { timeout: 15000 }),
      customerAccountPage.clickPostNewJob(),
    ]);

    // Assert – Step 8: Відкрилась сторінка https://staging.nocowboys.co.nz/new/jobs/index/post
    await expect(page).toHaveURL(/.*\/new\/jobs\/index\/post/);

    // Assert – Step 9: На сторінці відображається форма "Post a new Job"
    await postNewJobPage.waitForPageLoad();
    await expect(postNewJobPage.formHeading).toBeVisible({ timeout: 10000 });

    // Generate random 5-digit number (10000-99999)
    const randomNumber = Math.floor(Math.random() * 90000) + 10000;
    const jobTitle = `Cursor Test Job from Bruno${randomNumber}`;
    const jobDescription = 'Cursor Test Job Description. This job was created in Cursor by the NCB-11 auto test';

    // Act – Step 10: Клікнути у поле Title: та ввести "Cursor Test Job from Bruno" + 5-ти значне рандомне число
    await postNewJobPage.enterTitle(jobTitle);

    // Act – Step 11: Клікнути у поле "Description:" та ввести опис
    await postNewJobPage.enterDescription(jobDescription);

    // Act – Step 12: Клікнути у поле "Job Category:" та ввести "Academic"
    await postNewJobPage.typeJobCategory('Academic');
    await page.waitForTimeout(800);

    // Assert – Step 13: Переконатись, що у випадаючому списку поля "Job Category:" відображається тільки "Academic"
    await postNewJobPage.verifyJobCategoryDropdownHasOnlyOption('Academic');

    // Act – Step 14: У випадаючому списку поля "Job Category:" клікнути на "Academic"
    await postNewJobPage.selectJobCategoryOption('Academic');
    await page.waitForTimeout(500);

    // Act – Step 15: У секції "Job Location:" клікнути у поле "Choose a region" та ввести "Wellington"
    await postNewJobPage.typeJobLocation('Wellington');
    await page.waitForTimeout(800);

    // Assert – Step 16: Переконатись, що у випадаючому списку поля "Choose a region" відображається тільки "Wellington Region"
    await postNewJobPage.verifyJobLocationDropdownHasOnlyOption('Wellington Region');

    // Act – Step 17: У випадаючому списку поля "Choose a region" клікнути на "Wellington Region"
    await postNewJobPage.selectJobLocationOption('Wellington Region');
    // Wait for dropdown to close and selection to be applied
    await page.waitForTimeout(800);

    // Assert – Step 18: Переконатись, що поле "selectize-control AreaIDSelectize single" (Job area) стало клікабельним
    // Wait for Area field to become clickable after Region selection (fields become active sequentially)
    const isJobAreaClickable = await postNewJobPage.waitForJobAreaFieldToBecomeClickable(10000);
    expect(isJobAreaClickable).toBe(true);

    // Act – Step 19: Клікнути у поле "Job area"
    await postNewJobPage.clickJobAreaField();
    await page.waitForTimeout(800);

    // Act – Step 20: У випадаючому списку поля Job area клікнути на "Porirua Area"
    await postNewJobPage.selectJobAreaOption('Porirua Area');
    await page.waitForTimeout(500); // Small pause after selection

    // Assert – Step 21: Переконатись, що поле "selectize-control SuburbAreaIDSelectize single" (Job suburb) стало клікабельним
    // Wait for Suburb field to become clickable after Area selection (fields become active sequentially)
    const isJobSuburbClickable = await postNewJobPage.waitForJobSuburbFieldToBecomeClickable(10000);
    expect(isJobSuburbClickable).toBe(true);

    // Act – Step 22: Клікнути у поле "Job suburb"
    await postNewJobPage.clickJobSuburbField();
    await page.waitForTimeout(800);

    // Act – Step 23: У випадаючому списку поля Job suburb клікнути на "Mana"
    await postNewJobPage.selectJobSuburbOption('Mana');
    await page.waitForTimeout(500);

    // Act – Step 24: Клікнути на кнопку "Submit"
    await Promise.all([
      page.waitForURL(/.*\/new\/jobs\/index\/view\/id\/\d+/, { timeout: 15000 }),
      postNewJobPage.clickSubmit(),
    ]);

    // Assert – Step 25: Переконатись, що відкрилась сторінка створеної джоби /new/jobs/index/view/id/
    await postNewJobPage.waitForJobViewPage();
    await postNewJobPage.verifyJobViewPageUrl();

    // Assert – Step 26: Переконатись, що на у заголовку сторінки відображається назва джоби, яку вводили на кроці 10
    const jobViewPageTitle = await postNewJobPage.getJobViewPageTitle();
    expect(jobViewPageTitle).toBeTruthy();
    expect(jobViewPageTitle?.trim()).toBe(jobTitle.trim());
  });
});
