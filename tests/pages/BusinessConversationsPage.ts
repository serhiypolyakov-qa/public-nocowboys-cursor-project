import { Page, Locator } from '@playwright/test';
import { BusinessDashboardBasePage } from './BusinessDashboardBasePage';

/**
 * Page Object for Business Conversations section (/business/conversations).
 * One page = one class.
 */
export class BusinessConversationsPage extends BusinessDashboardBasePage {
  readonly conversationsHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.conversationsHeading = page.getByRole('heading', {
      name: /Select a conversation/i,
    });
  }

  async waitForPage(): Promise<void> {
    await this.page.waitForURL(/.*\/business\/conversations/, { timeout: 10000 });
    await this.conversationsHeading.waitFor({ state: 'visible', timeout: 10000 });
  }
}
