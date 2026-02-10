import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Customer Ratings Page
 * Handles customer ratings page elements and actions
 */
export class CustomerRatingsPage {
  readonly page: Page;
  
  // Ratings page locators
  readonly rateBusinessButton: Locator;
  readonly ratingsHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Rate a Business button: <a href="/search-business" class="btn btn-primary btn-primary-dashboard">
    this.rateBusinessButton = page.locator('a.btn-primary-dashboard[href="/search-business"]').filter({ hasText: 'Rate a Business' });
    
    // Ratings heading: <h3>Ratings</h3>
    this.ratingsHeading = page.getByRole('heading', { name: 'Ratings' });
  }

  /**
   * Navigate to the customer ratings page
   */
  async goto(): Promise<void> {
    await this.page.goto('/customers/ratings');
  }

  /**
   * Wait for the customer ratings page to load
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForURL(/.*\/customers\/ratings/, { timeout: 10000 });
    await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    await this.ratingsHeading.waitFor({ state: 'visible', timeout: 10000 });
  }
}
