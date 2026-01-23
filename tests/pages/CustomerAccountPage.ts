import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Customer Account Dashboard Page
 * Handles customer account page elements and actions
 */
export class CustomerAccountPage {
  readonly page: Page;
  
  // Customer account page locators
  readonly customerNameHeading: Locator;
  readonly activeJobsSection: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Customer name heading: <h1>Bruno Fernandes</h1>
    // DOM Path: div.main-content > section.container-fluid.container-user-personal.container-customer-personal > div.row[1] > div.container > div.row > div.col-md-12.title-wrap > h1
    // Using more flexible selector with partial class matching for stability
    this.customerNameHeading = page.locator('div.main-content section[class*="container-customer-personal"] div.row:first-child h1');
    
    // Active Jobs section: heading "Active Jobs"
    // Using role-based selector with heading text for better reliability
    this.activeJobsSection = page.getByRole('heading', { name: 'Active Jobs' });
  }

  /**
   * Navigate to the customer account page
   */
  async goto(): Promise<void> {
    await this.page.goto('/customers/account');
  }

  /**
   * Wait for the customer account page to load
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForURL(/.*\/customers\/account/, { timeout: 10000 });
    await this.customerNameHeading.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Get customer full name text
   */
  async getCustomerName(): Promise<string | null> {
    return await this.customerNameHeading.textContent();
  }

  /**
   * Check if Active Jobs section is visible
   */
  async isActiveJobsSectionVisible(): Promise<boolean> {
    try {
      await this.activeJobsSection.waitFor({ state: 'visible', timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }
}
