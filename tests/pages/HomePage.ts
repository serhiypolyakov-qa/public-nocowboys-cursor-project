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

  // Logo - for navigating back to home
  readonly logoLink: Locator;

  // Find a business (hero) locators
  readonly findABusinessBox: Locator;
  readonly findBusinessPanel: Locator;
  readonly categorySelectizeInput: Locator;
  readonly locationSelectizeInput: Locator;
  readonly findTopMatchesButton: Locator;
  readonly selectizeDropdownOption: Locator;

  // Review a business (hero) locators
  readonly reviewABusinessBox: Locator;
  readonly reviewBusinessPanel: Locator;
  readonly reviewBusinessSearchInput: Locator;
  readonly reviewBusinessAutocompleteResults: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Login button – prompt: <span class="navbar-login-item">Log In</span> inside <a href="/login">
    this.loginButton = page.locator('a[href="/login"]').filter({ has: page.locator('.navbar-login-item') }).first().or(page.getByRole('link', { name: 'Log In' }));
    
    // Search button - using ID selector from provided HTML: <a id="header-search-container-open" href="#" class="search-open-icon fa fa-search">
    this.searchButton = page.locator('#header-search-container-open');
    
    // Search input field - appears after clicking search button
    // Common patterns: input[type="search"], input[name*="search"], #search-input, etc.
    // Using a flexible selector that should work for most search implementations
    this.searchInput = page.locator('input[type="search"], input[name*="search"], input[id*="search"], input[placeholder*="search" i], input[class*="search" i]').first();
    
    // Search dropdown results - appears after typing in search field
    // Common patterns: .search-results, .dropdown-menu, .autocomplete-results, [class*="search-result"], etc.
    this.searchDropdownResults = page.locator('.search-results, .dropdown-menu, .autocomplete-results, [class*="search-result"], [class*="autocomplete"], ul[role="listbox"]').first();

    // Logo - link to home page, typically in navbar
    this.logoLink = page.locator('header a[href="/"], .navbar-brand[href="/"], a.navbar-brand').first();

    // "Find a business" – кнопка; після кліку з'являються поля категорії та локації
    this.findABusinessBox = page.locator('#hero-choice-find');
    // Блок з полями вводу (з'являється після кліку на кнопку "Find a business")
    this.findBusinessPanel = page.locator('#find-business-panel');
    // Поле категорії "Help me find"
    this.categorySelectizeInput = page.locator('#find-business-panel form#HomepageCategoryLocation .selectize-control.categoryIdSelectize .selectize-input input, #find-business-panel form#HomepageCategoryLocation input[placeholder="Just start typing..."]').first();
    // Поле локації "in or around"
    this.locationSelectizeInput = page.locator('#find-business-panel form#HomepageCategoryLocation .selectize-control.areaIdSelectize .selectize-input input').first();
    // Кнопка "Find Top Matches" – стає клікабельною після введення категорії та локації
    this.findTopMatchesButton = page.locator('#areaCategorySubmit');
    // Selectize dropdown options (rendered at body or within panel)
    this.selectizeDropdownOption = page.locator('.selectize-dropdown .option, .selectize-dropdown [data-selectable]');

    // "Review a business" – кнопка; після кліку з'являється поле пошуку бізнесів по назві
    // DOM Path: section#homepage-hero-search-container > div.container container-homepage-top > div#hero-choice-container > div#hero-choice-review
    // HTML Element: <div class="hero-choice-box" id="hero-choice-review" data-target="review-business-panel">
    this.reviewABusinessBox = page.locator('#hero-choice-review');
    // Блок з полем пошуку (з'являється після кліку на кнопку "Review a business")
    // DOM Path: section#homepage-hero-search-container > div.container container-homepage-top > div#review-business-panel
    this.reviewBusinessPanel = page.locator('#review-business-panel');
    // Поле пошуку бізнесів по назві
    // DOM Path: section#homepage-hero-search-container > div.container container-homepage-top > div#review-business-panel > div.homepage-.earch-bar review-bu.ine.-.earch > form#ReviewBusinessSearchForm > div.form-group review-.earch-group > input#review-business-search-input
    // HTML Element: <input type="text" id="review-business-search-input" name="searchstring" class="form-control" placeholder="Type the business name here" autocomplete="off" maxlength="255">
    this.reviewBusinessSearchInput = page.locator('#review-business-search-input');
    // Випадаючий список результатів автодоповнення
    // DOM Path: section#homepage-hero-search-container > div.container container-homepage-top > div#review-business-panel > div.homepage-.earch-bar review-bu.ine.-.earch > form#ReviewBusinessSearchForm > div#review-business-autocomplete-results > div.autocomplete-item
    this.reviewBusinessAutocompleteResults = page.locator('#review-business-autocomplete-results .autocomplete-item');
  }

  /**
   * Navigate to the home page
   */
  async goto(): Promise<void> {
    await this.page.goto('/', { 
      waitUntil: 'domcontentloaded',
      timeout: 60000 
    });
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

  /**
   * Click the logo to navigate to home page
   */
  async clickLogo(): Promise<void> {
    await this.logoLink.click();
  }

  /**
   * Клікнути кнопку "Find a business". Після кліку з'являються поля вводу категорії та локації.
   */
  async clickFindABusiness(): Promise<void> {
    await this.findABusinessBox.scrollIntoViewIfNeeded();
    await this.findABusinessBox.waitFor({ state: 'visible', timeout: 10000 });
    await this.findABusinessBox.click();
    // Wait for panel to appear after click
    await this.findBusinessPanel.waitFor({ state: 'attached', timeout: 10000 });
  }

  /**
   * Дочекатися появу полів категорії та локації після кліку на "Find a business".
   * Чекаємо прив'язку поля до DOM (панель/input можуть бути "hidden" через CSS/Selectize).
   */
  async waitForFindBusinessPanel(): Promise<void> {
    await this.categorySelectizeInput.waitFor({ state: 'attached', timeout: 15000 });
  }

  /**
   * Ввести категорію в поле "Help me find" (відкриває випадаючий список категорій).
   * Чекаємо прив'язку елемента до DOM (може бути "hidden" через Selectize), скролимо у видиму зону, клік з force.
   */
  async typeCategory(text: string): Promise<void> {
    // Wait for panel to be attached first
    await this.findBusinessPanel.waitFor({ state: 'attached', timeout: 15000 });
    // Wait for input to be attached
    await this.categorySelectizeInput.waitFor({ state: 'attached', timeout: 10000 });
    // Try to scroll panel into view first, then the input
    await this.findBusinessPanel.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500); // Small delay for animation
    await this.categorySelectizeInput.click({ force: true });
    await this.categorySelectizeInput.fill(text);
  }

  /**
   * Click an option in the selectize dropdown by exact text (e.g. "Academic")
   * Selectize dropdown may be positioned in a way Playwright considers "hidden"; use force click.
   */
  async selectSelectizeOption(optionText: string): Promise<void> {
    const option = this.page.locator('.selectize-dropdown .option, .selectize-dropdown [data-selectable]').filter({ hasText: new RegExp(`^${optionText}$`, 'i') }).first();
    await option.waitFor({ state: 'attached', timeout: 5000 });
    await option.click({ force: true });
  }

  /**
   * Ввести локацію в поле "in or around" (відкриває випадаючий список локацій).
   */
  async typeLocation(text: string): Promise<void> {
    await this.locationSelectizeInput.click({ force: true });
    await this.locationSelectizeInput.fill(text);
  }

  /**
   * Клікнути кнопку "Find Top Matches" (активна після заповнення категорії та локації).
   * Відкривається сторінка пошуку бізнесів по категорії та локації.
   */
  async clickFindTopMatches(): Promise<void> {
    await this.findTopMatchesButton.click();
  }

  /**
   * Клікнути кнопку "Review a business". Після кліку з'являється поле пошуку бізнесів по назві.
   */
  async clickReviewABusiness(): Promise<void> {
    await this.reviewABusinessBox.scrollIntoViewIfNeeded();
    await this.reviewABusinessBox.click();
  }

  /**
   * Дочекатися появи поля пошуку бізнесів після кліку на "Review a business".
   */
  async waitForReviewBusinessPanel(): Promise<void> {
    await this.reviewBusinessSearchInput.waitFor({ state: 'attached', timeout: 15000 });
  }

  /**
   * Ввести назву бізнесу в поле пошуку "Review a business" (відкриває випадаючий список результатів).
   */
  async typeReviewBusinessSearch(businessName: string): Promise<void> {
    await this.reviewBusinessSearchInput.click({ force: true });
    await this.reviewBusinessSearchInput.fill(businessName);
  }

  /**
   * Дочекатися появи випадаючого списку результатів автодоповнення.
   */
  async waitForReviewBusinessAutocompleteResults(): Promise<void> {
    await this.reviewBusinessAutocompleteResults.first().waitFor({ state: 'attached', timeout: 8000 });
  }

  /**
   * Клікнути на результат автодоповнення за назвою бізнесу.
   * Використовується селектор span.business-name для знаходження назви бізнесу в результаті.
   * DOM Path: div.autocomplete-item > span.business-name
   */
  async clickReviewBusinessAutocompleteResult(businessName: string): Promise<void> {
    const businessNameSpan = this.reviewBusinessAutocompleteResults
      .locator('span.business-name', { hasText: businessName })
      .first();
    await businessNameSpan.waitFor({ state: 'attached', timeout: 5000 });
    await businessNameSpan.click({ force: true });
  }
}
