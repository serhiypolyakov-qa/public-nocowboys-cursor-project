import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Business Account Created Success Page
 * Encapsulates all selectors and actions for the account creation success page
 */
export class BusinessAccountCreatedPage {
  readonly page: Page;

  // Success message locator
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Success message - using stable selector from HTML: h1 with text "Account Successfully Created"
    // HTML: <h1>Account Successfully Created</h1>
    this.successMessage = page.getByRole('heading', { name: 'Account Successfully Created' });
  }

  /**
   * Navigate to the business account created page (for direct navigation if needed)
   */
  async goto(): Promise<void> {
    await this.page.goto('/register/business-account-created');
  }

  /**
   * Wait for the page to load
   * Verifies that the success message is visible
   */
  async waitForPageLoad(): Promise<void> {
    await this.successMessage.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Verify that the page URL contains the expected path
   * Expected URL pattern: /register/business-account-created/
   */
  async verifyUrl(): Promise<void> {
    await this.page.waitForURL(/.*\/register\/business-account-created/, { timeout: 10000 });
  }
}
