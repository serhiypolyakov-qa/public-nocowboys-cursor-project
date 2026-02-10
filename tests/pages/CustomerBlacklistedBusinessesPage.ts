import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Customer Blacklisted Businesses Page
 * Handles customer blacklisted businesses page elements and actions
 */
export class CustomerBlacklistedBusinessesPage {
  readonly page: Page;
  
  // Blacklisted Businesses page locators
  readonly blacklistHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Blacklist heading: <h2>Blacklist</h2>
    this.blacklistHeading = page.getByRole('heading', { name: 'Blacklist' });
  }

  /**
   * Navigate to the customer blacklisted businesses page
   */
  async goto(): Promise<void> {
    await this.page.goto('/customers/account/blacklist-businesses');
  }

  /**
   * Wait for the customer blacklisted businesses page to load
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForURL(/.*\/customers\/account\/blacklist-businesses/, { timeout: 10000 });
    await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    await this.blacklistHeading.waitFor({ state: 'visible', timeout: 10000 });
  }
}
