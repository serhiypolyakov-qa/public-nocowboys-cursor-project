import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Customer Subscription Preferences Page
 * Handles customer subscription preferences page elements and actions
 */
export class CustomerSubscriptionPreferencesPage {
  readonly page: Page;
  
  // Subscription Preferences page locators
  readonly subscriptionPreferencesHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Subscription Preferences heading: <h2>Subscription Preferences</h2>
    this.subscriptionPreferencesHeading = page.getByRole('heading', { name: 'Subscription Preferences' });
  }

  /**
   * Navigate to the customer subscription preferences page
   */
  async goto(): Promise<void> {
    await this.page.goto('/customers/account/subscription-preferences');
  }

  /**
   * Wait for the customer subscription preferences page to load
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForURL(/.*\/customers\/account\/subscription-preferences/, { timeout: 10000 });
    await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    await this.subscriptionPreferencesHeading.waitFor({ state: 'visible', timeout: 10000 });
  }
}
