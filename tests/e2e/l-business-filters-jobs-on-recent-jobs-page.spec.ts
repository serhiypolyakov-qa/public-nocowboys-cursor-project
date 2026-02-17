import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { BusinessDashboardPage } from '../pages/BusinessDashboardPage';
import { BusinessDashboardJobsPage } from '../pages/BusinessDashboardJobsPage';
import { JobsPage } from '../pages/JobsPage';
import { RecentJobsPage } from '../pages/RecentJobsPage';

/**
 * NCB-27 Business filters jobs on the "Recent Jobs" page
 *
 * Test Steps:
 * 1. Go to https://staging.nocowboys.co.nz (HTTP auth from .env), maximize browser window
 * 2. Click Login button
 * 3. Enter BUSINESS_LOGIN_TEST_LOGIN in Login field
 * 4. Enter BUSINESS_LOGIN_TEST_PASSWORD in Password field
 * 5. Click Log in
 * 6. Verify business dashboard is open and BUSINESS_LOGIN_TEST_BUSINESS_NAME is displayed
 * 7. Клікнути на вкладку дашборду "Jobs"
 * 8. У секції "Jobs" клікнути на підвкладку "Open"
 * 9. Переконатись, що відкрилась сторінка https://staging.nocowboys.co.nz/new/jobs
 * 10. Клікнути на кнопку "Recent Jobs"
 * 11. Переконатись, що відкрилась сторінка https://staging.nocowboys.co.nz/new/jobs/index/recent-jobs
 * 12. Переконатись, що відображається фільтр джобів "Filter results by..."
 * 13. У полі фільтра Select Category ввести "Academic", після чого клікнути у випадаючому списку категорій на "Academic"
 * 14. У полі фільтра Select Suburb ввести "Porirua Area", після чого клікнути у випадаючому списку категорій на "Porirua Area"
 * 15. Клікнути на кнопку Show results
 * 16. Переконатись, що відображаються джоби тільки з категорією "Tuition & Coaching › Academic" та локацією "Porirua Area"
 * 17. Клікнути кнопку "Reset filter"
 * 18. Переконатися, що поля фільтру Категорія та Локація очистились
 */
test.describe('NCB-27 Business filters jobs on the "Recent Jobs" page', () => {
  // Large viewport to simulate full screen
  test.use({ viewport: { width: 1920, height: 1080 } });

  test('NCB-27-BusinessFiltersJobsOnRecentJobsPage - should login, navigate to Jobs/Open, then to Recent Jobs page and verify filter is displayed', async ({ page }) => {
    // Arrange
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const dashboardPage = new BusinessDashboardPage(page);
    const businessDashboardJobsPage = new BusinessDashboardJobsPage(page);
    const jobsPage = new JobsPage(page);
    const recentJobsPage = new RecentJobsPage(page);

    const businessEmail = process.env.BUSINESS_LOGIN_TEST_LOGIN;
    const businessPassword = process.env.BUSINESS_LOGIN_TEST_PASSWORD;
    const expectedBusinessName = process.env.BUSINESS_LOGIN_TEST_BUSINESS_NAME;

    if (!businessEmail || !businessPassword || !expectedBusinessName) {
      throw new Error(
        'Missing required env: BUSINESS_LOGIN_TEST_LOGIN, BUSINESS_LOGIN_TEST_PASSWORD, or BUSINESS_LOGIN_TEST_BUSINESS_NAME'
      );
    }

    // Act - Step 1: Navigate to staging (HTTP auth from playwright.config / .env)
    await homePage.goto();

    // Act - Step 2: Click Login
    await homePage.clickLogin();

    await loginPage.emailInput.waitFor({ state: 'visible', timeout: 10000 });

    // Act - Step 3 & 4: Enter login and password
    await loginPage.enterEmail(businessEmail);
    await loginPage.enterPassword(businessPassword);

    // Act - Step 5: Click Log in and wait for navigation
    await Promise.all([
      page.waitForURL(/.*\/business/, { timeout: 15000 }),
      loginPage.clickLoginSubmit(),
    ]);

    await dashboardPage.waitForPageLoad();

    // Assert - Step 6: Business dashboard is open and business name is displayed
    await expect(page).toHaveURL(/.*\/business/);

    const actualBusinessName = await dashboardPage.getBusinessName();
    expect(actualBusinessName).toBeTruthy();
    expect(actualBusinessName?.trim()).toBe(expectedBusinessName.trim());

    // Act - Step 7: Click dashboard tab "Jobs"
    await dashboardPage.clickJobsTab();
    await page.waitForTimeout(500);

    // Act - Step 8: Wait for Jobs page to load, then click on "Open" sub-tab
    await businessDashboardJobsPage.waitForPage();
    await businessDashboardJobsPage.clickJobsSubTab('Open');

    // Act - Step 9: Wait for navigation to /new/jobs page
    await jobsPage.waitForPageLoad();

    // Assert - Step 9: Verify that page opened with URL https://staging.nocowboys.co.nz/new/jobs
    await expect(page).toHaveURL(/.*\/new\/jobs$/);

    // Act - Step 10: Click on "Recent Jobs" button
    await Promise.all([
      page.waitForURL(/.*\/new\/jobs\/index\/recent-jobs/, { timeout: 15000 }),
      jobsPage.clickRecentJobsButton(),
    ]);

    // Assert - Step 11: Verify that page opened with URL https://staging.nocowboys.co.nz/new/jobs/index/recent-jobs
    await expect(page).toHaveURL(/.*\/new\/jobs\/index\/recent-jobs/);

    // Act - Step 12: Wait for Recent Jobs page to load
    await recentJobsPage.waitForPageLoad();

    // Assert - Step 12: Verify that jobs filter "Filter results by..." is displayed
    await expect(recentJobsPage.jobsFilter).toBeVisible();

    // Act - Step 13: Type "Academic" in Select Category field and select it from dropdown
    await recentJobsPage.typeSelectCategory('Academic');
    await page.waitForTimeout(800);
    await recentJobsPage.selectCategoryOption('Academic');
    await page.waitForTimeout(500);

    // Act - Step 14: Type "Porirua Area" in Select Suburb field and select it from dropdown
    await recentJobsPage.typeSelectSuburb('Porirua Area');
    await page.waitForTimeout(800);
    await recentJobsPage.selectSuburbOption('Porirua Area');
    await page.waitForTimeout(500);

    // Act - Step 15: Click on "Show results" button
    await recentJobsPage.clickShowResults();
    
    // Wait for filter to complete and results to load
    await recentJobsPage.waitForFilterResults();

    // Assert - Step 16: Verify that all displayed jobs have category "Tuition & Coaching › Academic" and location "Porirua Area"
    const jobItems = await recentJobsPage.getJobItems();
    
    // Verify that at least one job is displayed
    expect(jobItems.length).toBeGreaterThan(0);

    // Verify each job item has the correct category and location
    for (let i = 0; i < jobItems.length; i++) {
      const jobItem = jobItems[i];
      const jobText = await jobItem.textContent();
      expect(jobText).toBeTruthy();
      
      // Check for category "Tuition & Coaching › Academic" or "Academic" in job text
      const hasCategory = jobText?.includes('Tuition & Coaching › Academic') || 
                         jobText?.includes('Academic') ||
                         jobText?.toLowerCase().includes('academic');
      expect(hasCategory, `Job item ${i + 1} should contain category "Tuition & Coaching › Academic" or "Academic". Job text: ${jobText?.substring(0, 300)}`).toBe(true);
      
      // Get location text from job item (location is displayed under the title in the job card)
      const locationText = await recentJobsPage.getJobLocationText(jobItem);
      
      // Check for location "Porirua Area" or "Porirua" in location text or in job text
      const hasLocation = locationText?.includes('Porirua Area') || 
                         locationText?.includes('Porirua') ||
                         locationText?.toLowerCase().includes('porirua') ||
                         jobText?.includes('Porirua Area') || 
                         jobText?.includes('Porirua') ||
                         jobText?.toLowerCase().includes('porirua') ||
                         false;
      
      expect(hasLocation, `Job item ${i + 1} should contain location "Porirua Area" or "Porirua". Location text: ${locationText?.substring(0, 100)}, Job text: ${jobText?.substring(0, 300)}`).toBe(true);
    }

    // Act - Step 17: Click on "Reset filter" button
    await recentJobsPage.clickResetFilter();
    await page.waitForTimeout(500);

    // Assert - Step 18: Verify that Category and Suburb filter fields are cleared
    const isCategoryCleared = await recentJobsPage.isCategoryFilterCleared();
    expect(isCategoryCleared, 'Category filter field should be cleared after clicking Reset filter').toBe(true);

    const isSuburbCleared = await recentJobsPage.isSuburbFilterCleared();
    expect(isSuburbCleared, 'Suburb filter field should be cleared after clicking Reset filter').toBe(true);
  });
});
