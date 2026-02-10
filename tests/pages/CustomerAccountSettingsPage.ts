import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Customer Account Settings Page
 * Handles customer account settings page elements and actions
 */
export class CustomerAccountSettingsPage {
  readonly page: Page;
  
  // Account Settings page locators
  readonly accountSettingsHeading: Locator;
  readonly contactAddressDetailsTab: Locator;
  readonly passwordTab: Locator;
  readonly accountSettingsForm: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Account Settings heading: <h2>Account Settings</h2>
    this.accountSettingsHeading = page.getByRole('heading', { name: 'Account Settings' });
    
    // Contact & Address Details tab: <a href="/customers/account/settings" ...>Contact & Address Details</a>
    this.contactAddressDetailsTab = page.locator('a[href="/customers/account/settings"]').filter({ hasText: 'Contact & Address Details' });
    
    // Password tab: <a href="/customers/account/change-password" ...>Password</a>
    this.passwordTab = page.locator('a[href="/customers/account/change-password"]').filter({ hasText: 'Password' });
    
    // Account Settings form: <div class="col-md-6">
    this.accountSettingsForm = page.locator('div.customer-account-settings div.col-md-6').first();
  }

  /**
   * Navigate to the customer account settings page
   */
  async goto(): Promise<void> {
    await this.page.goto('/customers/account/settings');
  }

  /**
   * Wait for the customer account settings page to load
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForURL(/.*\/customers\/account\/settings/, { timeout: 10000 });
    await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    await this.accountSettingsHeading.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Click on Password tab within Account Settings
   */
  async clickPasswordTab(): Promise<void> {
    await this.passwordTab.click();
    await this.page.waitForURL(/.*\/customers\/account\/change-password/, { timeout: 10000 });
  }
}
