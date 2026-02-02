import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Search by Category and Location Results Page
 *
 * Відкривається після кліку на кнопку "Find Top Matches" (після введення категорії та локації).
 * Інша сторінка, ніж результати пошуку по назві бізнесу.
 * URL: /search/:area/:category (наприклад /search/wellington-cbd/academic)
 */
export class CategoryLocationSearchResultsPage {
  readonly page: Page;

  readonly searchResultsContainer: Locator;
  readonly businessResultsList: Locator;
  readonly headerCategoryDisplay: Locator;
  readonly headerLocationDisplay: Locator;

  constructor(page: Page) {
    this.page = page;

    // Results container on category+location search page
    this.searchResultsContainer = page.locator('#business-search');

    // Business results list: ul.business-search
    this.businessResultsList = page.locator('#business-search div.col-md-9 ul.business-search').first();

    // Header: category and location filter displays (selectize)
    this.headerCategoryDisplay = page.locator('header .selectize-control.categoryIdSelectize .selectize-input, header .categoryIdSelectize .selectize-input').first();
    this.headerLocationDisplay = page.locator('header .selectize-control.areaIdSelectize .selectize-input, header .areaIdSelectize .selectize-input').first();
  }

  /**
   * Wait for the category + location search results page to load
   * (URL pattern: /search/:area/:category)
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForURL(/.*\/search\/[^/]+\/[^/]+/i, { timeout: 15000 });
    await this.searchResultsContainer.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Get the displayed category value in the header (e.g. "Academic")
   */
  async getCategoryDisplayValue(): Promise<string | null> {
    return await this.headerCategoryDisplay.textContent();
  }

  /**
   * Get the displayed location/area value in the header (e.g. "Wellington CBD")
   */
  async getLocationDisplayValue(): Promise<string | null> {
    const input = this.headerLocationDisplay.locator('input').first();
    const count = await input.count();
    if (count > 0) {
      const value = await input.inputValue();
      if (value) return value;
    }
    return await this.headerLocationDisplay.textContent();
  }

  /**
   * Get locator for the business results list (ul.business-search)
   */
  getBusinessResultsList(): Locator {
    return this.businessResultsList;
  }

  /**
   * Get all business result items (li) in the list
   */
  getAllBusinessResults(): Locator {
    return this.businessResultsList.locator('li').filter({ has: this.page.locator('h3') });
  }
}
