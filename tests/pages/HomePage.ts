import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Home Page
 * Handles navigation to login page and search functionality
 */
export class HomePage {
  readonly page: Page;
  
  // Navigation locator (using role-based selector with text)
  readonly loginButton: Locator;
  
  // Search functionality locators
  readonly searchButton: Locator;
  readonly searchInput: Locator;
  readonly searchDropdownResults: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Login button - using role-based selector with text from HTML: <a href="/login"><span class="navbar-login-item">Log In</span></a>
    this.loginButton = page.getByRole('link', { name: 'Log In' });
    
    // Search button - using ID selector from provided HTML: <a id="header-search-container-open" href="#" class="search-open-icon fa fa-search">
    this.searchButton = page.locator('#header-search-container-open');
    
    // Search input field - appears after clicking search button
    // Common patterns: input[type="search"], input[name*="search"], #search-input, etc.
    // Using a flexible selector that should work for most search implementations
    this.searchInput = page.locator('input[type="search"], input[name*="search"], input[id*="search"], input[placeholder*="search" i], input[class*="search" i]').first();
    
    // Search dropdown results - appears after typing in search field
    // Common patterns: .search-results, .dropdown-menu, .autocomplete-results, [class*="search-result"], etc.
    this.searchDropdownResults = page.locator('.search-results, .dropdown-menu, .autocomplete-results, [class*="search-result"], [class*="autocomplete"], ul[role="listbox"]').first();
  }

  /**
   * Navigate to the home page
   */
  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  /**
   * Click the Login button
   */
  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  /**
   * Click the Search Business by name button
   */
  async clickSearchButton(): Promise<void> {
    await this.searchButton.click();
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
    return this.searchDropdownResults.locator('li, div[class*="result"], a[class*="result"]');
  }

  /**
   * Wait for dropdown results to appear
   */
  async waitForDropdownResults(): Promise<void> {
    await this.searchDropdownResults.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
      // Dropdown might not appear, continue anyway
    });
  }
}
