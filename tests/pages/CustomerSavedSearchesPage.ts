import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Customer Saved Searches Page
 * Handles customer saved searches page elements and actions
 */
export class CustomerSavedSearchesPage {
  readonly page: Page;
  
  // Saved Searches page locators
  readonly savedSearchesHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Saved Searches heading: <h2>Saved Searches</h2>
    this.savedSearchesHeading = page.getByRole('heading', { name: 'Saved Searches' });
  }

  /**
   * Navigate to the customer saved searches page
   */
  async goto(): Promise<void> {
    await this.page.goto('/customers/account/search-parameters');
  }

  /**
   * Wait for the customer saved searches page to load
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForURL(/.*\/customers\/account\/search-parameters/, { timeout: 10000 });
    await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    await this.savedSearchesHeading.waitFor({ state: 'visible', timeout: 10000 });
  }
}
