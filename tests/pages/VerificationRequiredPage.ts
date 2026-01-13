import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Verification Required Page
 * Handles the success page after customer registration
 */
export class VerificationRequiredPage {
  readonly page: Page;
  
  // Success message locator (using role-based selector)
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Success message - using role-based selector from HTML: <h1>Account Successfully Created</h1>
    this.successMessage = page.getByRole('heading', { name: 'Account Successfully Created' });
  }

  /**
   * Wait for the page to load
   */
  async waitForPageLoad(): Promise<void> {
    // Wait for success message to appear (indicates page loaded)
    // This is more reliable than waiting for networkidle
    await this.successMessage.waitFor({ state: 'visible', timeout: 30000 });
  }

  /**
   * Check if success message is visible
   */
  async isSuccessMessageVisible(): Promise<boolean> {
    return await this.successMessage.isVisible();
  }
}
