import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Business Account Dashboard Page
 * Handles business account page elements and actions
 */
export class BusinessAccountPage {
  readonly page: Page;
  
  // Business account page locators
  readonly businessNameHeading: Locator;
  readonly dashboardTab: Locator;
  readonly businessProfileTab: Locator;
  readonly ratingsTab: Locator;
  readonly badgesTab: Locator;
  readonly messagesTab: Locator;
  readonly jobsTab: Locator;
  readonly yourBusinessProfileHeading: Locator;
  readonly businessProfileSubTabs: Locator;
  readonly ratingsHeading: Locator;
  readonly ratingsSubTabs: Locator;
  readonly badgesHeading: Locator;
  readonly messagesHeading: Locator;
  readonly jobsHeading: Locator;
  readonly jobsSubTabs: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Business name heading: <h1>Greenice Web Development</h1>
    // DOM Path: div.main-content > section.container-fluid.container-user-personal.container-business-personal > div.row[3] > div.container.title-bar > div.row > div.col-md-7.title-wrap > h1
    // Using more flexible selector with partial class matching for stability
    this.businessNameHeading = page.locator('div.main-content section[class*="container-business-personal"] div.container.title-bar h1');
    
    // Dashboard tab: <div class="nav-tab-content">Dashboard</div>
    // DOM Path: div.main-content > section.container-fluid.container-user-personal.container-business-personal > div.row[4] > div.container.dashboard-tab > div.row > ul.nav.nav-tabs.nav-v3.nav-tabs-v3.nav-tabs-main > li.active > a > div.nav-tab-content
    // Using text-based selector within nav-tabs context for better reliability
    this.dashboardTab = page.locator('div.main-content section[class*="container-business-personal"] ul.nav-tabs li.active div.nav-tab-content').filter({ hasText: 'Dashboard' });

    // Business Profile tab (main dashboard tab, same nav as Dashboard)
    this.businessProfileTab = page.locator('div.main-content section[class*="container-business-personal"] ul.nav-tabs li div.nav-tab-content').filter({ hasText: 'Business Profile' }).first();

    // Ratings tab (main dashboard tab, same nav as Dashboard)
    this.ratingsTab = page.locator('div.main-content section[class*="container-business-personal"] ul.nav-tabs li div.nav-tab-content').filter({ hasText: 'Ratings' }).first();

    // Badges tab (main dashboard tab)
    this.badgesTab = page.locator('div.main-content section[class*="container-business-personal"] ul.nav-tabs li div.nav-tab-content').filter({ hasText: 'Badges' }).first();

    // Messages tab (main dashboard tab)
    this.messagesTab = page.locator('div.main-content section[class*="container-business-personal"] ul.nav-tabs li div.nav-tab-content').filter({ hasText: 'Messages' }).first();

    // Jobs tab (main dashboard tab)
    this.jobsTab = page.locator('div.main-content section[class*="container-business-personal"] ul.nav-tabs li div.nav-tab-content').filter({ hasText: 'Jobs' }).first();

    // Your Business Profile section heading (exact to avoid matching "Continue setting up your business profile")
    this.yourBusinessProfileHeading = page.getByRole('heading', { name: 'Your Business Profile', exact: true });

    // Ratings section heading (h2 or similar containing "Ratings")
    this.ratingsHeading = page.getByRole('heading', { name: /Ratings/i });

    // Badges section heading (contains "Achievement Badges")
    this.badgesHeading = page.getByRole('heading', { name: /Achievement Badges/i });

    // Messages section heading (contains "Messages")
    this.messagesHeading = page.getByRole('heading', { name: /Messages/i });

    // Jobs section heading (exact to avoid matching "You've reviewed these jobs" or similar)
    this.jobsHeading = page.getByRole('heading', { name: 'Jobs', exact: true });

    // Sub-tabs under "Your Business Profile": only links inside ul.section-sub-nav (not main nav)
    // DOM: div.business-profile... > ul.nav-tabs.section-sub-nav > li > a (About Your Business, Your Logo / Media, etc.)
    this.businessProfileSubTabs = page.locator('div.main-content').filter({ has: this.yourBusinessProfileHeading }).locator('ul[class*="section-sub-nav"] li a');

    // Sub-tabs under "Ratings" section (same pattern as Business Profile)
    this.ratingsSubTabs = page.locator('div.main-content').filter({ has: this.ratingsHeading }).locator('ul[class*="section-sub-nav"] li a');

    // Sub-tabs under "Jobs" section (same pattern as Business Profile and Ratings)
    this.jobsSubTabs = page.locator('div.main-content').filter({ has: this.jobsHeading }).locator('ul[class*="section-sub-nav"] li a');
  }

  /**
   * Navigate to the business account page
   */
  async goto(): Promise<void> {
    await this.page.goto('/business');
  }

  /**
   * Wait for the business account page to load fully before proceeding.
   * Waits for: URL, network idle, business name heading, and main nav (Dashboard tab).
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForURL(/.*\/business/, { timeout: 15000 });
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
    await this.businessNameHeading.waitFor({ state: 'visible', timeout: 15000 });
    await this.dashboardTab.waitFor({ state: 'visible', timeout: 15000 });
  }

  /**
   * Get business name text
   */
  async getBusinessName(): Promise<string | null> {
    return await this.businessNameHeading.textContent();
  }

  /**
   * Check if Dashboard tab is visible
   */
  async isDashboardTabVisible(): Promise<boolean> {
    try {
      await this.dashboardTab.waitFor({ state: 'visible', timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Click the Business Profile tab (main dashboard tab)
   */
  async clickBusinessProfileTab(): Promise<void> {
    await this.businessProfileTab.click();
  }

  /**
   * Wait for the Your Business Profile section to load (heading visible)
   */
  async waitForBusinessProfileSection(): Promise<void> {
    await this.yourBusinessProfileHeading.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Get visible sub-tab labels under "Your Business Profile" section (e.g. About Your Business, Your Logo / Media).
   * Returns trimmed text of each tab element.
   */
  async getBusinessProfileSubTabTexts(): Promise<string[]> {
    const count = await this.businessProfileSubTabs.count();
    const texts: string[] = [];
    for (let i = 0; i < count; i++) {
      const t = await this.businessProfileSubTabs.nth(i).textContent();
      if (t) texts.push(t.trim());
    }
    return texts;
  }

  /**
   * Click the Ratings tab (main dashboard tab)
   */
  async clickRatingsTab(): Promise<void> {
    await this.ratingsTab.click();
  }

  /**
   * Wait for the Ratings section to load (URL and heading visible)
   */
  async waitForRatingsSection(): Promise<void> {
    await this.page.waitForURL(/.*\/business\/ratings/, { timeout: 10000 });
    await this.ratingsHeading.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Get visible sub-tab labels under "Ratings" section (e.g. Ratings for Greenice Web Development, Request a Rating, Review QR Code).
   * Returns trimmed text of each tab element.
   */
  async getRatingsSubTabTexts(): Promise<string[]> {
    const count = await this.ratingsSubTabs.count();
    const texts: string[] = [];
    for (let i = 0; i < count; i++) {
      const t = await this.ratingsSubTabs.nth(i).textContent();
      if (t) texts.push(t.trim());
    }
    return texts;
  }

  /**
   * Click the Badges tab (main dashboard tab)
   */
  async clickBadgesTab(): Promise<void> {
    await this.badgesTab.click();
  }

  /**
   * Wait for the Badges section to load (URL and heading visible)
   */
  async waitForBadgesSection(): Promise<void> {
    await this.page.waitForURL(/.*\/business\/badges/, { timeout: 10000 });
    await this.badgesHeading.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Click the Messages tab (main dashboard tab)
   */
  async clickMessagesTab(): Promise<void> {
    await this.messagesTab.click();
  }

  /**
   * Wait for the Messages section to load (URL and heading visible)
   */
  async waitForMessagesSection(): Promise<void> {
    await this.page.waitForURL(/.*\/business\/correspondence/, { timeout: 10000 });
    await this.messagesHeading.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Click the Jobs tab (main dashboard tab)
   */
  async clickJobsTab(): Promise<void> {
    await this.jobsTab.click();
  }

  /**
   * Wait for the Jobs section to load (URL and heading visible)
   */
  async waitForJobsSection(): Promise<void> {
    await this.page.waitForURL(/.*\/business\/jobs/, { timeout: 10000 });
    await this.jobsHeading.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Get visible sub-tab labels under "Jobs" section (e.g. Open, Watchlist, Reviewed, Replied To, Quoted On).
   * Returns trimmed text of each tab element.
   */
  async getJobsSubTabTexts(): Promise<string[]> {
    const count = await this.jobsSubTabs.count();
    const texts: string[] = [];
    for (let i = 0; i < count; i++) {
      const t = await this.jobsSubTabs.nth(i).textContent();
      if (t) texts.push(t.trim());
    }
    return texts;
  }
}
