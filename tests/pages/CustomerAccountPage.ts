import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Customer Account Dashboard Page (Jobs)
 * Handles customer account Jobs page elements, actions, and navigation to other dashboard pages
 */
export class CustomerAccountPage {
  readonly page: Page;
  
  // Customer account page locators (Jobs page)
  readonly customerNameHeading: Locator;
  readonly activeJobsSection: Locator;
  readonly postNewJobButton: Locator;
  
  // Dashboard tab navigation locators (shared navigation for all dashboard pages)
  readonly jobsTab: Locator;
  readonly ratingsTab: Locator;
  readonly favouritesTab: Locator;
  readonly sharedFavouritesTab: Locator;
  readonly savedSearchesTab: Locator;
  readonly conversationsTab: Locator;
  readonly accountSettingsTab: Locator;
  readonly subscriptionPreferencesTab: Locator;
  readonly blacklistedBusinessesTab: Locator;
  readonly moreTabsDropdown: Locator;
  
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
    
    // Post a new job button: <a href="/new/jobs/index/post" class="btn btn-primary btn-primary-dashboard btn-dashboard-margin">
    this.postNewJobButton = page.locator('a.btn-primary-dashboard[href="/new/jobs/index/post"]').filter({ hasText: 'Post a new job' });
    
    // Dashboard tabs – scoped to customer section; tabs may be div.nav-tab-content (not links) in the real DOM
    const customerPersonalSection = page.locator('div.main-content section[class*="container-customer-personal"]');
    const createTabLocator = (name: RegExp | string) =>
      customerPersonalSection.locator('div.nav-tab-content').filter({ hasText: name }).first();

    this.jobsTab = createTabLocator(/^Jobs$/);
    this.ratingsTab = createTabLocator(/^Ratings$/);
    this.favouritesTab = createTabLocator(/^Favourites$/);
    this.sharedFavouritesTab = createTabLocator(/^Shared Favourites$/);
    this.savedSearchesTab = createTabLocator(/^Saved Searches$/);
    this.conversationsTab = customerPersonalSection.locator('div.nav-tab-content').filter({ hasText: 'Conversations' }).first();
    this.accountSettingsTab = createTabLocator(/^Account Settings$/);
    this.subscriptionPreferencesTab = customerPersonalSection.locator('div.nav-tab-content').filter({ hasText: 'Subscription Preferences' }).first();
    this.blacklistedBusinessesTab = customerPersonalSection.locator('div.nav-tab-content').filter({ hasText: 'Blacklisted Businesses' }).first();

    // "..." more tabs dropdown – only the icon in the tab bar (more_horiz), not other material-icons on the page
    this.moreTabsDropdown = customerPersonalSection.locator('span.material-icons').filter({ hasText: 'more_horiz' });
    
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
    await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
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

  /**
   * Click on the "..." dropdown menu to reveal hidden tabs
   */
  async clickMoreTabsDropdown(): Promise<void> {
    await this.moreTabsDropdown.click();
    // Wait a bit for dropdown to open
    await this.page.waitForTimeout(500);
  }

  /**
   * Click on Jobs tab (default tab)
   */
  async clickJobsTab(): Promise<void> {
    await this.jobsTab.click();
    await this.page.waitForURL(/.*\/customers\/account\/?$/, { timeout: 10000 });
  }

  /**
   * Click on Ratings tab
   */
  async clickRatingsTab(): Promise<void> {
    await this.ratingsTab.click();
    await this.page.waitForURL(/.*\/customers\/ratings/, { timeout: 10000 });
  }

  /**
   * Click on Favourites tab
   */
  async clickFavouritesTab(): Promise<void> {
    await this.favouritesTab.click();
    await this.page.waitForURL(/.*\/customers\/account\/favourites/, { timeout: 10000 });
  }

  /**
   * Click on Shared Favourites tab
   */
  async clickSharedFavouritesTab(): Promise<void> {
    await this.sharedFavouritesTab.click();
    await this.page.waitForURL(/.*\/customers\/account\/shared-favourites/, { timeout: 10000 });
  }

  /**
   * Click on Saved Searches tab
   */
  async clickSavedSearchesTab(): Promise<void> {
    await this.savedSearchesTab.click();
    await this.page.waitForURL(/.*\/customers\/account\/search-parameters/, { timeout: 10000 });
  }

  /**
   * Click on Conversations tab
   */
  async clickConversationsTab(): Promise<void> {
    await this.conversationsTab.click();
    await this.page.waitForURL(/.*\/customers\/conversations/, { timeout: 10000 });
  }

  /**
   * Click on Account Settings tab
   */
  async clickAccountSettingsTab(): Promise<void> {
    await this.accountSettingsTab.click();
    await this.page.waitForURL(/.*\/customers\/account\/settings/, { timeout: 10000 });
  }

  /**
   * Click on Subscription Preferences tab
   */
  async clickSubscriptionPreferencesTab(): Promise<void> {
    await this.subscriptionPreferencesTab.click();
    await this.page.waitForURL(/.*\/customers\/account\/subscription-preferences/, { timeout: 10000 });
  }

  /**
   * Click on Blacklisted Businesses tab
   */
  async clickBlacklistedBusinessesTab(): Promise<void> {
    await this.blacklistedBusinessesTab.click();
    await this.page.waitForURL(/.*\/customers\/account\/blacklist-businesses/, { timeout: 10000 });
  }

}
