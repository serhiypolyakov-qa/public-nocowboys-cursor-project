import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Search Results Page (search by business name)
 *
 * This page is used when searching by business name (e.g. header search or Dandruff).
 * URL pattern: /search-business/:query
 *
 * For search by category and location (URL /search/:area/:category), use CategoryLocationSearchResultsPage.
 */
export class SearchResultsPage {
  readonly page: Page;

  // Search results locators (search by name page)
  readonly searchResultsContainer: Locator;
  readonly businessResults: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;

    // Search results container - using the business-search div
    this.searchResultsContainer = page.locator('#business-search');

    // Search input field on "search by name" results page
    this.searchInput = page.locator('input[name="searchString"]');

    // Business results list on "search by name" page
    const mainResultsList = page.locator('#business-search div.col-md-9 ul.business-search').first();
    this.businessResults = mainResultsList.locator('li').filter({ has: page.locator('h3') });
  }

  /**
   * Wait for the search results page to load
   */
  async waitForPageLoad(): Promise<void> {
    // Wait for URL to contain search-business path
    await this.page.waitForURL(/.*\/search-business\/.*/i, { timeout: 10000 }).catch(() => {
      // URL might not contain "search-business", continue anyway
    });
    
    // Wait for results container to be visible
    await this.searchResultsContainer.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
      // Results might load differently, continue anyway
    });
  }

  /**
   * Get the search input value
   */
  async getSearchInputValue(): Promise<string | null> {
    return await this.searchInput.inputValue();
  }

  /**
   * Check if search input is visible
   */
  async isSearchInputVisible(): Promise<boolean> {
    try {
      await this.searchInput.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get all business result items
   * Returns locator for all business results on the page
   */
  getAllBusinessResults(): Locator {
    return this.businessResults;
  }

  /**
   * Get business name from a result item
   * Returns locator for business name within a result item
   * Based on page structure: heading level 3 contains the business name with a link inside
   * From error context: heading "Greenice 0307" [level=3] contains link "Greenice 0307"
   */
  getBusinessName(resultItem: Locator): Locator {
    // Business name is in h3 > a link
    return resultItem.locator('h3 a, h3').first();
  }

  /**
   * Get business name text from a result item
   */
  async getBusinessNameText(resultItem: Locator): Promise<string | null> {
    return await this.getBusinessName(resultItem).textContent();
  }
}
