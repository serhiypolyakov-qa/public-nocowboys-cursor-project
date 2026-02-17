import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { BusinessDashboardPage } from '../pages/BusinessDashboardPage';
import { BusinessProfilePage } from '../pages/BusinessProfilePage';
import { BusinessRatingsPage } from '../pages/BusinessRatingsPage';
import { BusinessBadgesPage } from '../pages/BusinessBadgesPage';
import { BusinessMessagesPage } from '../pages/BusinessMessagesPage';
import { BusinessDashboardJobsPage } from '../pages/BusinessDashboardJobsPage';
import { BusinessSupportPage } from '../pages/BusinessSupportPage';
import { BusinessConversationsPage } from '../pages/BusinessConversationsPage';
import { BusinessAccountSettingsPage } from '../pages/BusinessAccountSettingsPage';
import { BusinessPayHerePage } from '../pages/BusinessPayHerePage';

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
 *
 * Steps (Part 6):
 * 20. Click dashboard tab "Support"
 * 21. Verify page /business/support loaded and heading contains "Support"
 * 22. Verify sub-tabs are displayed: "Support Topics" and "Contact Form"
 * 23. Click dashboard tab "Conversations"
 * 24. Verify page /business/conversations loaded and heading contains "Select a conversation"
 * 25. Click dashboard tab "Account Settings"
 * 26. Verify page /business/settings loaded and heading contains "Account Settings"
 * 27. Verify sub-tabs are displayed: "Contact & Address Details", "Password", "Notifications" and "Account Status"
 * 28. Click on sub-tab "Password"
 * 29. Verify heading contains "Update Password"
 * 30. Click on sub-tab "Notifications"
 * 31. Verify heading contains "Notifications Preferences"
 * 32. Click on sub-tab "Account Status"
 * 33. Verify that displayed heading contains "Account Status" and "Make a payment"
 * 34. Click dashboard tab "Pay Here"
 * 35. Verify that displayed heading contains "Account Status" and "Make a payment"
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

  // Sub-tabs under "Support" section
  const expectedSupportSubTabs = ['Support Topics', 'Contact Form'];

  // Sub-tabs under "Account Settings" section
  const expectedAccountSettingsSubTabs = [
    'Contact & Address Details',
    'Password',
    'Notifications',
    'Account Status',
  ];

  test('Part 1, 2, 3, 4, 5 & 6 - should login, open Business Profile, Ratings, Badges, Messages, Jobs, Support, Conversations and Account Settings and verify headings', async ({ page }) => {
    // Arrange
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const dashboardPage = new BusinessDashboardPage(page);
    const businessProfilePage = new BusinessProfilePage(page);
    const ratingsPage = new BusinessRatingsPage(page);
    const badgesPage = new BusinessBadgesPage(page);
    const messagesPage = new BusinessMessagesPage(page);
    const businessDashboardJobsPage = new BusinessDashboardJobsPage(page);
    const supportPage = new BusinessSupportPage(page);
    const conversationsPage = new BusinessConversationsPage(page);
    const accountSettingsPage = new BusinessAccountSettingsPage(page);
    const payHerePage = new BusinessPayHerePage(page);

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

    // Act - Step 7: Click dashboard tab "Business Profile"
    await dashboardPage.clickBusinessProfileTab();

    // Act - Step 8: Wait for Business Profile page to load
    await businessProfilePage.waitForPage();

    // Assert - Step 8: Page opened with heading "Your Business Profile"
    await expect(businessProfilePage.yourBusinessProfileHeading).toBeVisible();

    // Assert - Step 9: Sub-tabs under "Your Business Profile" are displayed (all visible must be from expected set; at least the first 3 required)
    const actualSubTabs = await businessProfilePage.getBusinessProfileSubTabTexts();
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
    await businessProfilePage.clickRatingsTab();
    await page.waitForTimeout(500);

    // Act - Step 11: Wait for Ratings page to load
    await ratingsPage.waitForPage();

    // Assert - Step 11: Page /business/ratings loaded and heading contains "Ratings"
    await expect(page).toHaveURL(/.*\/business\/ratings/);
    await expect(ratingsPage.ratingsHeading).toBeVisible();
    const ratingsHeadingText = await ratingsPage.ratingsHeading.textContent();
    expect(ratingsHeadingText?.trim()).toContain('Ratings');

    // Assert - Step 12: Sub-tabs under "Ratings" are displayed (Ratings for {businessName}, Request a Rating, Review QR Code)
    const actualRatingsSubTabs = await ratingsPage.getRatingsSubTabTexts();
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
    await ratingsPage.clickBadgesTab();
    await page.waitForTimeout(500);

    // Act - Step 14: Wait for Badges page to load
    await badgesPage.waitForPage();

    // Assert - Step 14: Page /business/badges loaded and heading contains "Achievement Badges"
    await expect(page).toHaveURL(/.*\/business\/badges/);
    await expect(badgesPage.badgesHeading).toBeVisible();
    const badgesHeadingText = await badgesPage.badgesHeading.textContent();
    expect(badgesHeadingText?.trim()).toContain('Achievement Badges');

    // Act - Step 15: Click dashboard tab "Messages"
    await badgesPage.clickMessagesTab();
    await page.waitForTimeout(500);

    // Act - Step 16: Wait for Messages page to load
    await messagesPage.waitForPage();

    // Assert - Step 16: Page /business/correspondence loaded and heading contains "Messages"
    await expect(page).toHaveURL(/.*\/business\/correspondence/);
    await expect(messagesPage.messagesHeading).toBeVisible();
    const messagesHeadingText = await messagesPage.messagesHeading.textContent();
    expect(messagesHeadingText?.trim()).toContain('Messages');

    // Act - Step 17: Click dashboard tab "Jobs"
    await messagesPage.clickJobsTab();
    await page.waitForTimeout(500);

    // Act - Step 18: Wait for Jobs page to load
    await businessDashboardJobsPage.waitForPage();

    // Assert - Step 18: Page /business/jobs loaded and heading contains "Jobs"
    await expect(page).toHaveURL(/.*\/business\/jobs/);
    await expect(businessDashboardJobsPage.jobsHeading).toHaveText('Jobs');

    // Assert - Step 19: Sub-tabs under "Jobs" are displayed (Open, Watchlist, Reviewed, Replied To, Quoted On)
    const actualJobsSubTabs = await businessDashboardJobsPage.getJobsSubTabTexts();
    
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

    // Act - Step 20: Click dashboard tab "Support"
    await businessDashboardJobsPage.clickSupportTab();
    await page.waitForTimeout(500);

    // Act - Step 21: Wait for Support page to load
    await supportPage.waitForPage();

    // Assert - Step 21: Page /business/support loaded and heading contains "Support"
    await expect(page).toHaveURL(/.*\/business\/support/);
    await expect(supportPage.supportHeading).toBeVisible();
    const supportHeadingText = await supportPage.supportHeading.textContent();
    expect(supportHeadingText?.trim()).toContain('Support');

    // Assert - Step 22: Sub-tabs under "Support" are displayed: Support Topics, Contact Form
    const actualSupportSubTabs = await supportPage.getSupportSubTabTexts();
    for (const expectedTab of expectedSupportSubTabs) {
      const expectedLower = expectedTab.toLowerCase();
      const found = actualSupportSubTabs.some((t) => t.toLowerCase().includes(expectedLower) || expectedLower.includes(t.toLowerCase()));
      expect(found, `Required Support sub-tab "${expectedTab}" not found. Actual: [${actualSupportSubTabs.join(', ')}]`).toBe(true);
    }

    // Act - Step 23: Click dashboard tab "Conversations"
    await supportPage.clickConversationsTab();
    await page.waitForTimeout(500);

    // Act - Step 24: Wait for Conversations page to load
    await conversationsPage.waitForPage();

    // Assert - Step 24: Page /business/conversations loaded and heading contains "Select a conversation"
    await expect(page).toHaveURL(/.*\/business\/conversations/);
    await expect(conversationsPage.conversationsHeading).toBeVisible();
    const conversationsHeadingText = await conversationsPage.conversationsHeading.textContent();
    expect(conversationsHeadingText?.trim()).toContain('Select a conversation');

    // Act - Step 25: Click dashboard tab "Account Settings"
    await conversationsPage.clickAccountSettingsTab();
    await page.waitForTimeout(500);

    // Act - Step 26: Wait for Account Settings page to load
    await accountSettingsPage.waitForPage();

    // Assert - Step 26: Page /business/settings loaded and heading contains "Account Settings"
    await expect(page).toHaveURL(/.*\/business\/settings/);
    await expect(accountSettingsPage.accountSettingsHeading).toBeVisible();
    const accountSettingsHeadingText = await accountSettingsPage.accountSettingsHeading.textContent();
    expect(accountSettingsHeadingText?.trim()).toContain('Account Settings');

    // Assert - Step 27: Sub-tabs under "Account Settings" are displayed
    const actualAccountSettingsSubTabs = await accountSettingsPage.getAccountSettingsSubTabTexts();
    for (const expectedTab of expectedAccountSettingsSubTabs) {
      const expectedLower = expectedTab.toLowerCase();
      const found = actualAccountSettingsSubTabs.some((t) => t.toLowerCase().includes(expectedLower) || expectedLower.includes(t.toLowerCase()));
      expect(found, `Required Account Settings sub-tab "${expectedTab}" not found. Actual: [${actualAccountSettingsSubTabs.join(', ')}]`).toBe(true);
    }

    // Act - Step 28: Click on sub-tab "Password"
    await accountSettingsPage.clickAccountSettingsSubTab('Password');
    await page.waitForTimeout(500);

    // Assert - Step 29: Heading contains "Update Password"
    await expect(accountSettingsPage.updatePasswordHeading).toBeVisible({ timeout: 10000 });
    const updatePasswordHeadingText = await accountSettingsPage.updatePasswordHeading.textContent();
    expect(updatePasswordHeadingText?.trim()).toContain('Update Password');

    // Act - Step 30: Click on sub-tab "Notifications"
    await accountSettingsPage.clickAccountSettingsSubTab('Notifications');
    await page.waitForTimeout(500);

    // Assert - Step 31: Heading contains "Notifications Preferences"
    await expect(accountSettingsPage.notificationsPreferencesHeading).toBeVisible({ timeout: 10000 });
    const notificationsHeadingText = await accountSettingsPage.notificationsPreferencesHeading.textContent();
    expect(notificationsHeadingText?.trim()).toContain('Notifications Preferences');

    // Act - Step 32: Click on sub-tab "Account Status"
    await accountSettingsPage.clickAccountSettingsSubTab('Account Status');
    await page.waitForTimeout(500);

    // Assert - Step 33: Displayed heading contains "Account Status" and "Make a payment"
    await expect(accountSettingsPage.accountStatusHeading).toBeVisible({ timeout: 10000 });
    await expect(accountSettingsPage.makeAPaymentText).toBeVisible({ timeout: 10000 });
    const accountStatusHeadingText = await accountSettingsPage.accountStatusHeading.textContent();
    expect(accountStatusHeadingText?.trim()).toContain('Account Status');

    // Act - Step 34: Click dashboard tab "Pay Here"
    await accountSettingsPage.clickPayHereTab();
    await page.waitForTimeout(500);

    // Act - Step 35: Wait for Pay Here page to load
    await payHerePage.waitForPage();

    // Assert - Step 35: Displayed heading contains "Account Status" and "Make a payment"
    await expect(payHerePage.accountStatusHeading).toBeVisible({ timeout: 10000 });
    await expect(payHerePage.makeAPaymentText).toBeVisible({ timeout: 10000 });
    const payHereAccountStatusHeadingText = await payHerePage.accountStatusHeading.textContent();
    expect(payHereAccountStatusHeadingText?.trim()).toContain('Account Status');
  });
});
