import { Page, Locator } from '@playwright/test';
import { BusinessDashboardBasePage } from './BusinessDashboardBasePage';

/**
 * Page Object for Business Messages/Correspondence section (/business/correspondence).
 * One page = one class.
 */
export class BusinessMessagesPage extends BusinessDashboardBasePage {
  readonly messagesHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.messagesHeading = page.getByRole('heading', { name: /Messages/i });
  }

  async waitForPage(): Promise<void> {
    await this.page.waitForURL(/.*\/business\/correspondence/, { timeout: 10000 });
    await this.messagesHeading.waitFor({ state: 'visible', timeout: 10000 });
  }
}
