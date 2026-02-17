import { Page, Locator } from '@playwright/test';
import { BusinessDashboardBasePage } from './BusinessDashboardBasePage';

/**
 * Page Object for Business Badges section (/business/badges).
 * One page = one class.
 */
export class BusinessBadgesPage extends BusinessDashboardBasePage {
  readonly badgesHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.badgesHeading = page.getByRole('heading', { name: /Achievement Badges/i });
  }

  async waitForPage(): Promise<void> {
    await this.page.waitForURL(/.*\/business\/badges/, { timeout: 10000 });
    await this.badgesHeading.waitFor({ state: 'visible', timeout: 10000 });
  }
}
