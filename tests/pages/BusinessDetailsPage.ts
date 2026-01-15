import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Business Details Page
 * Handles interaction with the business details page after email verification
 */
export class BusinessDetailsPage {
  readonly page: Page;

  // Page title/heading locator
  readonly aboutYourBusinessHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // About your Business heading - using role-based selector with text
    // HTML: <h1>About your Business</h1> or similar heading
    this.aboutYourBusinessHeading = page.getByRole('heading', { name: /About your Business/i });
  }

  /**
   * Navigate to the business details page (for direct navigation if needed)
   */
  async goto(): Promise<void> {
    await this.page.goto('/register/business-details');
  }

  /**
   * Wait for the page to load
   * Verifies that the "About your Business" heading is visible
   */
  async waitForPageLoad(): Promise<void> {
    await this.aboutYourBusinessHeading.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Verify that the page URL contains the expected path
   * Expected URL pattern: /register/business-details/
   */
  async verifyUrl(): Promise<void> {
    await this.page.waitForURL(/.*\/register\/business-details/, { timeout: 10000 });
  }
}
