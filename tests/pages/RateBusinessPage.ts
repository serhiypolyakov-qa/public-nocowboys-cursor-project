import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Rate Business Page
 * Handles interaction with the rate/review business page
 */
export class RateBusinessPage {
  readonly page: Page;
  
  // Page heading locator
  readonly rateBusinessHeading: Locator;
  
  // Rating form locator
  readonly ratingForm: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Rate business heading: <h1>Rate Greenice Web Development</h1>
    // DOM Path: section.container container-main > h1
    // Using more flexible selector to handle spaces in class names
    this.rateBusinessHeading = page.locator('section.container h1').first();
    
    // Rating form: <div class="col-md-6">
    // DOM Path: section.container container-main > div.row > div.col-md-6
    // Using class selector for the form container
    this.ratingForm = page.locator('section.container.container-main div.row div.col-md-6').first();
  }

  /**
   * Navigate to the rate business page (for direct navigation if needed)
   */
  async goto(businessSlug: string): Promise<void> {
    await this.page.goto(`/businesses/${businessSlug}/rate`);
  }

  /**
   * Wait for the rate business page to load
   * Verifies that the rate business heading is visible
   */
  async waitForPageLoad(): Promise<void> {
    await this.rateBusinessHeading.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Get the rate business heading text (business name)
   */
  async getRateBusinessHeading(): Promise<string | null> {
    return await this.rateBusinessHeading.textContent();
  }

  /**
   * Verify that the rating form is visible
   */
  async isRatingFormVisible(): Promise<boolean> {
    try {
      await this.ratingForm.waitFor({ state: 'visible', timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }
}
