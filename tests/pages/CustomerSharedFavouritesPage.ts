import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Customer Shared Favourites Page
 * Handles customer shared favourites page elements and actions
 */
export class CustomerSharedFavouritesPage {
  readonly page: Page;
  
  // Shared Favourites page locators
  readonly sharedFavouritesHeading: Locator;
  readonly saveSharedFavouritesButton: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Shared Favourites heading: <h2>Shared Favourites</h2>
    this.sharedFavouritesHeading = page.getByRole('heading', { name: 'Shared Favourites' });
    
    // Save shared favourites button: <input type="submit" id="save-shared-favourites" ...>
    this.saveSharedFavouritesButton = page.locator('input#save-shared-favourites');
  }

  /**
   * Navigate to the customer shared favourites page
   */
  async goto(): Promise<void> {
    await this.page.goto('/customers/account/shared-favourites');
  }

  /**
   * Wait for the customer shared favourites page to load
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForURL(/.*\/customers\/account\/shared-favourites/, { timeout: 10000 });
    await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    await this.sharedFavouritesHeading.waitFor({ state: 'visible', timeout: 10000 });
  }
}
