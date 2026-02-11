import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Recent Jobs Page (/new/jobs/index/recent-jobs)
 * Handles elements and actions on the recent jobs page with filters
 */
export class RecentJobsPage {
  readonly page: Page;

  // Jobs filter locator
  readonly jobsFilter: Locator;

  // Filter field locators (selectize fields)
  readonly selectCategoryInput: Locator;
  readonly selectSuburbInput: Locator;

  // Show results button
  readonly showResultsButton: Locator;

  // Reset filter button
  readonly resetFilterButton: Locator;

  // Selectize dropdown options (general)
  readonly selectizeDropdownOption: Locator;

  // Job list items locators
  readonly jobItems: Locator;
  readonly jobCategoryLabels: Locator;
  readonly jobLocationLabels: Locator;

  constructor(page: Page) {
    this.page = page;

    // Jobs filter - filter element on Recent Jobs page (contains "Filter results by...")
    this.jobsFilter = page.locator('text=/Filter results by/i').or(page.getByText(/Filter results by/i));

    // Select Category selectize field - look for input within selectize control for category
    // Try multiple patterns: by label text, placeholder, or class name
    this.selectCategoryInput = page.locator(
      'label:has-text("Category") + .selectize-control .selectize-input input, ' +
      '.selectize-control:has(label:has-text("Category")) .selectize-input input, ' +
      '.selectize-control input[placeholder*="Category" i], ' +
      '.selectize-control input[placeholder*="Select Category" i], ' +
      'label:has-text("Select Category") ~ .selectize-control .selectize-input input'
    ).first();

    // Select Suburb selectize field - look for input within selectize control for suburb
    // Try multiple patterns: by label text, placeholder, or class name
    this.selectSuburbInput = page.locator(
      'label:has-text("Suburb") + .selectize-control .selectize-input input, ' +
      '.selectize-control:has(label:has-text("Suburb")) .selectize-input input, ' +
      '.selectize-control input[placeholder*="Suburb" i], ' +
      '.selectize-control input[placeholder*="Select Suburb" i], ' +
      'label:has-text("Select Suburb") ~ .selectize-control .selectize-input input'
    ).first();

    // Show results button
    this.showResultsButton = page.getByRole('button', { name: /Show results/i }).or(page.locator('button').filter({ hasText: /Show results/i })).first();

    // Reset filter button
    // DOM Path: form.nocowboy.-form > div.form-group > a.btn.btn-danger.btn-sm.job-btn
    // HTML: <a href="/new/jobs/index/recent-jobs" class="btn btn-danger btn-sm job-btn">Reset filter</a>
    this.resetFilterButton = page.locator('a.btn.btn-danger.btn-sm.job-btn')
      .filter({ hasText: /Reset filter/i })
      .or(page.getByRole('link', { name: /Reset filter/i }))
      .first();

    // Selectize dropdown options (general)
    this.selectizeDropdownOption = page.locator('.selectize-dropdown .option, .selectize-dropdown [data-selectable]');

    // Job list items - containers for each job in the results
    // DOM Path: div.job.-wrapper.grid-view > div.job > div.job-card
    this.jobItems = page.locator(
      'div.job.-wrapper div.job, ' +
      'div.job-card, ' +
      'div[class*="job"]:has(div.job-card), ' +
      '[class*="job-item"], ' +
      '[class*="JobItem"], ' +
      'article[class*="job"]'
    );

    // Job category labels - text showing category in each job item
    this.jobCategoryLabels = page.locator('[class*="category"], [class*="Category"], .job-category');

    // Job location labels - text showing location/suburb in each job item
    this.jobLocationLabels = page.locator('[class*="location"], [class*="Location"], [class*="suburb"], [class*="Suburb"], .job-location, .job-suburb');
  }

  /**
   * Navigate to the recent jobs page
   */
  async goto(): Promise<void> {
    await this.page.goto('/new/jobs/index/recent-jobs');
  }

  /**
   * Wait for the Recent Jobs page to load (URL and filter visible)
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForURL(/.*\/new\/jobs\/index\/recent-jobs/, { timeout: 15000 });
    await this.jobsFilter.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Type text in the Select Category selectize field (opens dropdown with categories)
   */
  async typeSelectCategory(text: string): Promise<void> {
    await this.selectCategoryInput.click({ force: true });
    await this.page.waitForTimeout(300);
    await this.selectCategoryInput.fill(text);
  }

  /**
   * Wait for Select Category dropdown options to appear
   */
  async waitForSelectCategoryDropdown(): Promise<void> {
    await this.selectizeDropdownOption.first().waitFor({ state: 'attached', timeout: 8000 });
  }

  /**
   * Select an option from Select Category dropdown by exact text (clicks the visible option)
   */
  async selectCategoryOption(optionText: string): Promise<void> {
    await this.waitForSelectCategoryDropdown();
    
    const option = this.page.locator('.selectize-dropdown .option, .selectize-dropdown [data-selectable]')
      .filter({ hasText: new RegExp(`^${optionText}$`, 'i') })
      .first();
    
    await option.waitFor({ state: 'attached', timeout: 5000 });
    await option.click({ force: true });
    await this.page.waitForTimeout(500);
  }

  /**
   * Type text in the Select Suburb selectize field (opens dropdown with suburbs)
   */
  async typeSelectSuburb(text: string): Promise<void> {
    await this.selectSuburbInput.click({ force: true });
    await this.page.waitForTimeout(300);
    await this.selectSuburbInput.fill(text);
  }

  /**
   * Wait for Select Suburb dropdown options to appear
   */
  async waitForSelectSuburbDropdown(): Promise<void> {
    await this.selectizeDropdownOption.first().waitFor({ state: 'attached', timeout: 8000 });
  }

  /**
   * Select an option from Select Suburb dropdown by exact text (clicks the visible option)
   */
  async selectSuburbOption(optionText: string): Promise<void> {
    await this.waitForSelectSuburbDropdown();
    
    const option = this.page.locator('.selectize-dropdown .option, .selectize-dropdown [data-selectable]')
      .filter({ hasText: new RegExp(`^${optionText}$`, 'i') })
      .first();
    
    await option.waitFor({ state: 'attached', timeout: 5000 });
    await option.click({ force: true });
    await this.page.waitForTimeout(500);
  }

  /**
   * Click the "Show results" button
   */
  async clickShowResults(): Promise<void> {
    await this.showResultsButton.click();
  }

  /**
   * Wait for filter results to load after clicking "Show results"
   * Waits for job items to appear or update - waits specifically for job results, not just network idle
   */
  async waitForFilterResults(): Promise<void> {
    // Wait for job items to appear/update after filter is applied
    // First, wait a bit for the filter request to start
    await this.page.waitForTimeout(500);
    
    // Wait for job items to be visible/updated
    // This is the main indicator that filter results have loaded
    try {
      // Wait for at least one job item to be visible
      await this.jobItems.first().waitFor({ state: 'visible', timeout: 20000 });
      
      // Wait a bit more to ensure all job items are loaded
      await this.page.waitForTimeout(1000);
      
      // Verify that job items are actually present
      const jobCount = await this.jobItems.count();
      if (jobCount === 0) {
        // If no jobs found, wait a bit more
        await this.page.waitForTimeout(2000);
      }
    } catch (error) {
      // If job items don't appear, wait for network to be idle as fallback
      await this.page.waitForLoadState('networkidle', { timeout: 15000 });
      await this.page.waitForTimeout(2000);
    }
    
    // Final wait to ensure all results are fully rendered
    await this.page.waitForTimeout(1000);
  }

  /**
   * Get all job items from the results list
   */
  async getJobItems(): Promise<Locator[]> {
    await this.jobItems.first().waitFor({ state: 'visible', timeout: 10000 });
    const count = await this.jobItems.count();
    const items: Locator[] = [];
    for (let i = 0; i < count; i++) {
      items.push(this.jobItems.nth(i));
    }
    return items;
  }

  /**
   * Get category text from a job item
   */
  async getJobCategoryText(jobItem: Locator): Promise<string | null> {
    // Try to find category text within the job item
    const categoryInItem = jobItem.locator('[class*="category"], [class*="Category"], .job-category').first();
    if (await categoryInItem.count() > 0) {
      return await categoryInItem.textContent();
    }
    // Fallback: search for text containing category pattern in the entire job item
    const itemText = await jobItem.textContent();
    return itemText;
  }

  /**
   * Get location/suburb text from a job item
   * Location is displayed in div.location inside div.job-card
   * DOM Path: div.job-card > div.location
   * HTML: <div class="location">Mana, Porirua Area</div>
   */
  async getJobLocationText(jobItem: Locator): Promise<string | null> {
    // Pattern 1: Look for div.location directly in job item or in job-card
    // First try to find job-card container if jobItem is the outer div.job
    const jobCard = jobItem.locator('div.job-card').first();
    let locationElement: Locator;
    
    if (await jobCard.count() > 0) {
      // Location is in div.job-card > div.location
      locationElement = jobCard.locator('div.location').first();
    } else {
      // If no job-card found, try to find location directly in jobItem
      locationElement = jobItem.locator('div.location').first();
    }
    
    if (await locationElement.count() > 0) {
      const text = await locationElement.textContent();
      if (text && text.trim()) {
        return text.trim();
      }
    }
    
    // Pattern 2: Fallback - try other location selectors
    const locationSelectors = [
      '.location',
      '[class*="location"]',
      '[class*="Location"]',
      '.job-location'
    ];
    
    for (const selector of locationSelectors) {
      const locationInItem = jobItem.locator(selector).first();
      if (await locationInItem.count() > 0) {
        const text = await locationInItem.textContent();
        if (text && text.trim()) {
          return text.trim();
        }
      }
    }
    
    return null;
  }

  /**
   * Click the "Reset filter" button
   */
  async clickResetFilter(): Promise<void> {
    // Wait for reset button to be visible
    await this.resetFilterButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.resetFilterButton.click();
    // Wait a bit for filters to reset
    await this.page.waitForTimeout(1000);
  }

  /**
   * Check if Category filter field is cleared (empty input or placeholder visible)
   */
  async isCategoryFilterCleared(): Promise<boolean> {
    const inputValue = await this.selectCategoryInput.inputValue();
    // Check if input is empty
    if (inputValue && inputValue.trim() !== '') {
      return false;
    }
    
    // Check if placeholder is visible (indicates field is empty)
    const placeholder = await this.selectCategoryInput.getAttribute('placeholder');
    if (placeholder) {
      return true;
    }
    
    // Check if selectize control shows placeholder/default state
    const selectizeControl = this.selectCategoryInput.locator('..').locator('..');
    const hasSelectedItems = await selectizeControl.locator('.item').count();
    return hasSelectedItems === 0;
  }

  /**
   * Check if Suburb filter field is cleared (empty input or placeholder visible)
   */
  async isSuburbFilterCleared(): Promise<boolean> {
    const inputValue = await this.selectSuburbInput.inputValue();
    // Check if input is empty
    if (inputValue && inputValue.trim() !== '') {
      return false;
    }
    
    // Check if placeholder is visible (indicates field is empty)
    const placeholder = await this.selectSuburbInput.getAttribute('placeholder');
    if (placeholder) {
      return true;
    }
    
    // Check if selectize control shows placeholder/default state
    const selectizeControl = this.selectSuburbInput.locator('..').locator('..');
    const hasSelectedItems = await selectizeControl.locator('.item').count();
    return hasSelectedItems === 0;
  }
}
