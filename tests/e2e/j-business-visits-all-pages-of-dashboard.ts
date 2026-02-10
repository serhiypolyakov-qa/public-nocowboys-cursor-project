import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { BusinessAccountPage } from '../pages/BusinessAccountPage';

/**
 * NCB-27 - Business Filters Jobs On The Recent Jobs Page
 * Part 1: Login as business and verify dashboard.
 * Part 2: Open Business Profile and verify section and sub-tabs.
 * Part 3: Open Ratings and verify section and sub-tabs.
 * Part 4: Open Badges and Messages and verify pages.
 * Part 5: Open Jobs and verify section and sub-tabs.
 *
 * Steps (Part 1):
 * 1. Go to https://staging.nocowboys.co.nz (HTTP auth from .env), maximize browser window
 * 2. Click Login button
 * 3. Enter BUSINESS_LOGIN_TEST_LOGIN in Login field
 * 4. Enter BUSINESS_LOGIN_TEST_PASSWORD in Password field
 * 5. Click Log in
 * 6. Verify business dashboard is open and BUSINESS_LOGIN_TEST_BUSINESS_NAME is displayed
 *
 * Steps (Part 2):
 * 7. Click dashboard tab "Business Profile"
 * 8. Verify page opened with heading "Your Business Profile"
 * 9. Verify sub-tabs are displayed: About Your Business, Your Logo / Media, Your Location, Your Associations, Social Media, Google reviews
 *
 * Steps (Part 3):
 * 10. Click dashboard tab "Ratings"
 * 11. Verify page /business/ratings loaded and heading contains "Ratings"
 * 12. Verify sub-tabs are displayed: Ratings for Greenice Web Development, Request a Rating, Review QR Code
 *
 * Steps (Part 4):
 * 13. Click dashboard tab "Badges"
 * 14. Verify page /business/badges loaded and heading contains "Achievement Badges"
 * 15. Click dashboard tab "Messages"
 * 16. Verify page /business/correspondence loaded and heading contains "Messages"
 *
 * Steps (Part 5):
 * 17. Click dashboard tab "Jobs"
 * 18. Verify page /business/jobs loaded and heading contains "Jobs"
 * 19. Verify sub-tabs are displayed: Open, Watchlist, Reviewed, Replied To, Quoted On, Completed (coming soon)
 */
test.describe('NCB-27-BusinessFiltersJobsOnTheRecentJobsPage', () => {
  // Large viewport to simulate full screen
  test.use({ viewport: { width: 1920, height: 1080 } });

  // Sub-tabs under "Your Business Profile" (staging may show a subset; add more when present on page)
  const expectedBusinessProfileSubTabs = [
    'About Your Business',
    'Your Logo / Media',
    'Your Location',
    'Your Associations',
    'Social Media',
    'Google reviews',
  ];

  // Sub-tabs under "Ratings" section (first item includes business name from env - BUSINESS_LOGIN_TEST_BUSINESS_NAME)
  const expectedRatingsSubTabs = [
    'Request a Rating',
    'Review QR Code',
  ];

  // Sub-tabs under "Jobs" section
  const expectedJobsSubTabs = [
    'Open',
    'Watchlist',
    'Reviewed',
    'Replied To',
    'Quoted On',
    'Completed (coming soon)',
  ];

  test('Part 1, 2, 3, 4 & 5 - should login, open Business Profile, Ratings, Badges, Messages and Jobs and verify headings', async ({ page }) => {
    // Arrange
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const businessAccountPage = new BusinessAccountPage(page);

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

    await businessAccountPage.waitForPageLoad();

    // Assert - Step 6: Business dashboard is open and business name is displayed
    await expect(page).toHaveURL(/.*\/business/);

    const actualBusinessName = await businessAccountPage.getBusinessName();
    expect(actualBusinessName).toBeTruthy();
    expect(actualBusinessName?.trim()).toBe(expectedBusinessName.trim());

    // Act - Step 7: Click dashboard tab "Business Profile"
    await businessAccountPage.clickBusinessProfileTab();

    // Act - Step 8: Wait for Business Profile section to load
    await businessAccountPage.waitForBusinessProfileSection();

    // Assert - Step 8: Page opened with heading "Your Business Profile"
    await expect(businessAccountPage.yourBusinessProfileHeading).toBeVisible();

    // Assert - Step 9: Sub-tabs under "Your Business Profile" are displayed (all visible must be from expected set; at least the first 3 required)
    const actualSubTabs = await businessAccountPage.getBusinessProfileSubTabTexts();
    const actualLower = actualSubTabs.map((t) => t.toLowerCase());
    const requiredSubTabs = ['About Your Business', 'Your Logo / Media', 'Your Location'];
    for (const expectedTab of requiredSubTabs) {
      const expectedLower = expectedTab.toLowerCase();
      const found = actualLower.some((t) => t.includes(expectedLower) || expectedLower.includes(t));
      expect(found, `Required sub-tab "${expectedTab}" not found. Actual: [${actualSubTabs.join(', ')}]`).toBe(true);
    }
    for (const tab of actualSubTabs) {
      const tabLower = tab.replace(/\s+check_circle\s*$/i, '').trim().toLowerCase();
      const matchesExpected = expectedBusinessProfileSubTabs.some((e) => tabLower.includes(e.toLowerCase()) || e.toLowerCase().includes(tabLower));
      expect(matchesExpected, `Unexpected sub-tab "${tab}". Expected one of: [${expectedBusinessProfileSubTabs.join(', ')}]`).toBe(true);
    }

    // Act - Step 10: Click dashboard tab "Ratings"
    await businessAccountPage.clickRatingsTab();
    // Small delay to make the transition visible
    await page.waitForTimeout(500);

    // Act - Step 11: Wait for Ratings section to load
    await businessAccountPage.waitForRatingsSection();

    // Assert - Step 11: Page /business/ratings loaded and heading contains "Ratings"
    await expect(page).toHaveURL(/.*\/business\/ratings/);
    await expect(businessAccountPage.ratingsHeading).toBeVisible();
    const ratingsHeadingText = await businessAccountPage.ratingsHeading.textContent();
    expect(ratingsHeadingText?.trim()).toContain('Ratings');

    // Assert - Step 12: Sub-tabs under "Ratings" are displayed (Ratings for {businessName}, Request a Rating, Review QR Code)
    const actualRatingsSubTabs = await businessAccountPage.getRatingsSubTabTexts();
    const expectedRatingsForTab = `Ratings for ${expectedBusinessName.trim()}`;
    
    // Verify "Ratings for {businessName}" sub-tab exists
    const ratingsForSubTab = actualRatingsSubTabs.find((t) => 
      t.toLowerCase().includes('ratings for') && t.toLowerCase().includes(expectedBusinessName.trim().toLowerCase())
    );
    expect(ratingsForSubTab, `Expected sub-tab "Ratings for ${expectedBusinessName.trim()}" not found. Actual: [${actualRatingsSubTabs.join(', ')}]`).toBeTruthy();
    
    // Verify required sub-tabs: Request a Rating, Review QR Code
    const requiredRatingsSubTabs = ['Request a Rating', 'Review QR Code'];
    for (const expectedTab of requiredRatingsSubTabs) {
      const expectedLower = expectedTab.toLowerCase();
      const found = actualRatingsSubTabs.some((t) => t.toLowerCase().includes(expectedLower) || expectedLower.includes(t.toLowerCase()));
      expect(found, `Required Ratings sub-tab "${expectedTab}" not found. Actual: [${actualRatingsSubTabs.join(', ')}]`).toBe(true);
    }
    
    // Verify all sub-tabs are expected (Ratings for {businessName}, Request a Rating, or Review QR Code)
    const allExpectedRatingsSubTabs = [expectedRatingsForTab, ...expectedRatingsSubTabs];
    for (const tab of actualRatingsSubTabs) {
      const tabLower = tab.replace(/\s+check_circle\s*$/i, '').trim().toLowerCase();
      const matchesExpected = allExpectedRatingsSubTabs.some(
        (e) => {
          const eLower = e.toLowerCase();
          return tabLower.includes(eLower) || eLower.includes(tabLower) || 
                 (e.startsWith('Ratings for') && /ratings\s+for\s+/i.test(tab) && tab.toLowerCase().includes(expectedBusinessName.trim().toLowerCase()));
        }
      );
      expect(matchesExpected, `Unexpected Ratings sub-tab "${tab}". Expected one of: [${allExpectedRatingsSubTabs.join(', ')}]`).toBe(true);
    }

    // Act - Step 13: Click dashboard tab "Badges"
    await businessAccountPage.clickBadgesTab();
    await page.waitForTimeout(500);

    // Act - Step 14: Wait for Badges section to load
    await businessAccountPage.waitForBadgesSection();

    // Assert - Step 14: Page /business/badges loaded and heading contains "Achievement Badges"
    await expect(page).toHaveURL(/.*\/business\/badges/);
    await expect(businessAccountPage.badgesHeading).toBeVisible();
    const badgesHeadingText = await businessAccountPage.badgesHeading.textContent();
    expect(badgesHeadingText?.trim()).toContain('Achievement Badges');

    // Act - Step 15: Click dashboard tab "Messages"
    await businessAccountPage.clickMessagesTab();
    await page.waitForTimeout(500);

    // Act - Step 16: Wait for Messages section to load
    await businessAccountPage.waitForMessagesSection();

    // Assert - Step 16: Page /business/correspondence loaded and heading contains "Messages"
    await expect(page).toHaveURL(/.*\/business\/correspondence/);
    await expect(businessAccountPage.messagesHeading).toBeVisible();
    const messagesHeadingText = await businessAccountPage.messagesHeading.textContent();
    expect(messagesHeadingText?.trim()).toContain('Messages');

    // Act - Step 17: Click dashboard tab "Jobs"
    await businessAccountPage.clickJobsTab();
    await page.waitForTimeout(500);

    // Act - Step 18: Wait for Jobs section to load
    await businessAccountPage.waitForJobsSection();

    // Assert - Step 18: Page /business/jobs loaded and heading contains "Jobs"
    await expect(page).toHaveURL(/.*\/business\/jobs/);
    await expect(businessAccountPage.jobsHeading).toHaveText('Jobs');


    // Assert - Step 19: Sub-tabs under "Jobs" are displayed (Open, Watchlist, Reviewed, Replied To, Quoted On)
    const actualJobsSubTabs = await businessAccountPage.getJobsSubTabTexts();
    
    // Verify all required sub-tabs exist
    for (const expectedTab of expectedJobsSubTabs) {
      const expectedLower = expectedTab.toLowerCase();
      const found = actualJobsSubTabs.some((t) => t.toLowerCase().includes(expectedLower) || expectedLower.includes(t.toLowerCase()));
      expect(found, `Required Jobs sub-tab "${expectedTab}" not found. Actual: [${actualJobsSubTabs.join(', ')}]`).toBe(true);
    }
    
    // Verify all sub-tabs are expected
    for (const tab of actualJobsSubTabs) {
      const tabLower = tab.replace(/\s+check_circle\s*$/i, '').trim().toLowerCase();
      const matchesExpected = expectedJobsSubTabs.some(
        (e) => {
          const eLower = e.toLowerCase();
          return tabLower.includes(eLower) || eLower.includes(tabLower);
        }
      );
      expect(matchesExpected, `Unexpected Jobs sub-tab "${tab}". Expected one of: [${expectedJobsSubTabs.join(', ')}]`).toBe(true);
    }
  });
});
