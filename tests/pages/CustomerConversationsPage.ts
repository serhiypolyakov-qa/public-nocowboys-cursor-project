import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Customer Conversations Page
 * Handles customer conversations page elements and actions
 */
export class CustomerConversationsPage {
  readonly page: Page;
  readonly conversationsHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.conversationsHeading = page.getByRole('heading', { name: 'Conversations' });
  }

  /**
   * Navigate to the customer conversations page
   */
  async goto(): Promise<void> {
    await this.page.goto('/customers/conversations');
  }

  /**
   * Wait for the customer conversations page to load
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForURL(/.*\/customers\/conversations/, { timeout: 10000 });
    await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
  }
}
