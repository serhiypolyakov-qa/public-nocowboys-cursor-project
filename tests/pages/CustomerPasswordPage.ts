import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Customer Password Page
 * Handles customer password change page elements and actions
 */
export class CustomerPasswordPage {
  readonly page: Page;
  
  // Password page locators
  readonly passwordForm: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Password form: <div class="col-sm-6 col-md-4">
    this.passwordForm = page.locator('div.customer-account-settings div.col-sm-6.col-md-4').first();
  }

  /**
   * Navigate to the customer password change page
   */
  async goto(): Promise<void> {
    await this.page.goto('/customers/account/change-password');
  }

  /**
   * Wait for the customer password change page to load
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForURL(/.*\/customers\/account\/change-password/, { timeout: 10000 });
    await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    await this.passwordForm.waitFor({ state: 'visible', timeout: 10000 });
  }
}
