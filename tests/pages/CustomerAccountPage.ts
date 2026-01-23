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
  
  // Search functionality locators (Dandruff button)
  readonly dandruffSearchButton: Locator;
  readonly searchInput: Locator;
  readonly searchDropdownResults: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Customer name heading: <h1>Bruno Fernandes</h1>
    // DOM Path: div.main-content > section.container-fluid.container-user-personal.container-customer-personal > div.row[1] > div.container > div.row > div.col-md-12.title-wrap > h1
    // Using more flexible selector with partial class matching for stability
    this.customerNameHeading = page.locator('div.main-content section[class*="container-customer-personal"] div.row:first-child h1');
    
    // Active Jobs section: heading "Active Jobs"
    // Using role-based selector with heading text for better reliability
    this.activeJobsSection = page.getByRole('heading', { name: 'Active Jobs' });
    
    // Dandruff search button: <a id="header-search-container-open" href="#" class="search-open-icon fa fa-search">
    // DOM Path: div.main-content > header > nav.navbar navbar-default > div.container-fluid container-navbar > div#mobile-menu > ul.nav navbar-nav > li.hidden-x > a#header-search-container-open
    this.dandruffSearchButton = page.locator('#header-search-container-open');
    
    // Search input field: <input type="text" name="searchstring" id="searchstring" value="" placeholder="Search by business name" class="form-control ui-autocomplete-input" autocomplete="off">
    this.searchInput = page.locator('#searchstring');
    
    // Search dropdown results: <li class="autocomplete-result autocomplete-result-business-name autocomplete-result-business-name-business ui-menu-item">
    this.searchDropdownResults = page.locator('li.autocomplete-result');
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

  /**
   * Click the Dandruff button (search icon) to open search
   */
  async clickDandruffSearchButton(): Promise<void> {
    await this.dandruffSearchButton.click();
  }

  /**
   * Enter search query in the search field
   */
  async enterSearchQuery(query: string): Promise<void> {
    await this.searchInput.fill(query);
  }

  /**
   * Press Enter key in the search field
   */
  async pressEnterInSearch(): Promise<void> {
    await this.searchInput.press('Enter');
  }

  /**
   * Get all dropdown search results
   * Returns locator for all results in the dropdown
   */
  getDropdownResults(): Locator {
    return this.searchDropdownResults;
  }

  /**
   * Wait for dropdown results to appear
   */
  async waitForDropdownResults(): Promise<void> {
    await this.searchDropdownResults.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
      // Dropdown might not appear, continue anyway
    });
  }

  /**
   * Get business name from dropdown result
   */
  async getBusinessNameFromDropdown(resultItem: Locator): Promise<string | null> {
    return await resultItem.locator('span.business-name').textContent();
  }
}
