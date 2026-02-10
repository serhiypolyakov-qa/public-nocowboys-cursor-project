import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Customer Favourites Page
 * Handles customer favourites page elements and actions
 */
export class CustomerFavouritesPage {
  readonly page: Page;
  
  // Favourites page locators
  readonly addFavouriteBusinessButton: Locator;
  readonly shareFavouritesButton: Locator;
  readonly favouritesHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Add a favourite business button: <a href="/search-business" class="btn btn-primary btn-primary-dashboard first-in-content-section-margin">
    this.addFavouriteBusinessButton = page.locator('a.btn-primary-dashboard[href="/search-business"]').filter({ hasText: 'Add a favourite business' });
    
    // Share favourites button: <a href="/customers/account/favourites/share" class="btn btn-primary btn-primary-dashboard first-in-content-section-margin">
    this.shareFavouritesButton = page.locator('a.btn-primary-dashboard[href="/customers/account/favourites/share"]').filter({ hasText: 'Share favourites' });
    
    // Favourites heading: <h2>Favourites</h2>
    this.favouritesHeading = page.getByRole('heading', { name: 'Favourites' });
  }

  /**
   * Navigate to the customer favourites page
   */
  async goto(): Promise<void> {
    await this.page.goto('/customers/account/favourites');
  }

  /**
   * Wait for the customer favourites page to load
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForURL(/.*\/customers\/account\/favourites/, { timeout: 10000 });
    await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    await this.favouritesHeading.waitFor({ state: 'visible', timeout: 10000 });
  }
}
