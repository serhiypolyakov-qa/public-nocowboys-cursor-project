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
  }

  /**
   * Navigate to the business account page
   */
  async goto(): Promise<void> {
    await this.page.goto('/business');
  }

  /**
   * Wait for the business account page to load
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForURL(/.*\/business/, { timeout: 10000 });
    await this.businessNameHeading.waitFor({ state: 'visible', timeout: 10000 });
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
}
