import { Page, Locator } from '@playwright/test';
import { BusinessDashboardBasePage } from './BusinessDashboardBasePage';

/**
 * Page Object for Business Dashboard home page (/business).
 * One page = one class.
 */
export class BusinessDashboardPage extends BusinessDashboardBasePage {
  readonly dashboardTab: Locator;

  constructor(page: Page) {
    super(page);
    this.dashboardTab = page
      .locator('div.main-content section[class*="container-business-personal"] ul.nav-tabs li.active div.nav-tab-content')
      .filter({ hasText: 'Dashboard' });
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForURL(/.*\/business/, { timeout: 15000 });
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
    await this.businessNameHeading.waitFor({ state: 'visible', timeout: 15000 });
    await this.dashboardTab.waitFor({ state: 'visible', timeout: 15000 });
  }

  async isDashboardTabVisible(): Promise<boolean> {
    try {
      await this.dashboardTab.waitFor({ state: 'visible', timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }
}
