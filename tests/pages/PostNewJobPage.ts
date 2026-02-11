import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for Post a new Job Page
 * Handles form elements and actions for posting a new job
 */
export class PostNewJobPage {
  readonly page: Page;

  // Form heading
  readonly formHeading: Locator;

  // Input field locators
  readonly titleInput: Locator;
  readonly descriptionInput: Locator;

  // Selectize field locators (Job Category, Job Location, Job Area, Job Suburb)
  readonly jobCategorySelectizeInput: Locator;
  readonly jobLocationSelectizeInput: Locator;
  readonly jobAreaSelectizeInput: Locator;
  readonly jobSuburbSelectizeInput: Locator;

  // Selectize dropdown options (general)
  readonly selectizeDropdownOption: Locator;
  
  // Specific dropdown options for Job Category
  readonly jobCategoryDropdownOptions: Locator;
  
  // Specific dropdown options for Job Location
  readonly jobLocationDropdownOptions: Locator;

  // Submit button
  readonly submitButton: Locator;

  // Job view page elements (after submission)
  readonly jobViewPageHeading: Locator;

  constructor(page: Page) {
    this.page = page;

    // Form heading: "Post a new Job"
    this.formHeading = page.getByRole('heading', { name: 'Post a new Job' });

    // Title field – from DOM: input#ClientName, name="ClientName", label "Title:"
    this.titleInput = page.locator('#ClientName');

    // Description field – from DOM: textarea#Description, name="Description", label "Description:"
    this.descriptionInput = page.locator('#Description');

    // Job Category selectize – from DOM: .selectize-control.CategoryIDSelectize (placeholder "Choose a category")
    this.jobCategorySelectizeInput = page.locator('.selectize-control.CategoryIDSelectize .selectize-input input');

    // Job Location (Choose a region) selectize – from DOM: .selectize-control.RegionIDSelectize (placeholder "Choose a region")
    this.jobLocationSelectizeInput = page.locator('.selectize-control.RegionIDSelectize .selectize-input input');

    // Job Area selectize – from DOM: .selectize-control.AreaIDSelectize (placeholder "Choose region first" or "Choose area first")
    this.jobAreaSelectizeInput = page.locator('.selectize-control.AreaIDSelectize .selectize-input input, input[placeholder*="Choose region first"], input[placeholder*="Choose area first"]').first();

    // Job Suburb selectize – from DOM: .selectize-control.SuburbAreaIDSelectize (placeholder "Choose area first")
    this.jobSuburbSelectizeInput = page.locator('.selectize-control.SuburbAreaIDSelectize .selectize-input input').first();

    // Selectize dropdown options (one dropdown visible at a time; scope by visible dropdown)
    this.selectizeDropdownOption = page.locator('.selectize-dropdown .option, .selectize-dropdown [data-selectable]');

    this.jobCategoryDropdownOptions = page.locator('.selectize-dropdown').filter({ has: page.locator('.option').filter({ hasText: /^Academic$/i }) }).locator('.option, [data-selectable]');
    this.jobLocationDropdownOptions = page.locator('.selectize-dropdown').filter({ has: page.locator('.option').filter({ hasText: /Wellington Region/i }) }).locator('.option, [data-selectable]');

    // Submit button – from DOM: button[type="submit"] or input[type="submit"] with text "Submit"
    this.submitButton = page.locator('button[type="submit"], input[type="submit"]').filter({ hasText: /Submit/i }).first();

    // Job view page heading (h1 with job title) – appears after successful submission
    this.jobViewPageHeading = page.locator('h1').first();
  }

  /**
   * Navigate to the Post a new Job page
   */
  async goto(): Promise<void> {
    await this.page.goto('/new/jobs/index/post');
  }

  /**
   * Wait for the Post a new Job page to load
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForURL(/.*\/new\/jobs\/index\/post/, { timeout: 10000 });
    await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    await this.formHeading.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Enter title in the Title field
   */
  async enterTitle(title: string): Promise<void> {
    await this.titleInput.click({ force: true });
    await this.titleInput.fill(title);
  }

  /**
   * Enter description in the Description field
   */
  async enterDescription(description: string): Promise<void> {
    await this.descriptionInput.click({ force: true });
    await this.descriptionInput.fill(description);
  }

  /**
   * Type text in the Job Category selectize field (opens dropdown with categories)
   */
  async typeJobCategory(text: string): Promise<void> {
    await this.jobCategorySelectizeInput.click({ force: true });
    await this.page.waitForTimeout(300);
    await this.jobCategorySelectizeInput.fill(text);
  }

  /**
   * Get all selectize dropdown options for Job Category
   * Returns locator for all options in the dropdown
   */
  getJobCategoryDropdownOptions(): Locator {
    return this.selectizeDropdownOption;
  }

  /**
   * Wait for Job Category dropdown options to appear
   */
  async waitForJobCategoryDropdown(): Promise<void> {
    await this.selectizeDropdownOption.first().waitFor({ state: 'attached', timeout: 8000 });
  }

  /**
   * Verify that only one option with specific text appears in Job Category dropdown (visible options only)
   */
  async verifyJobCategoryDropdownHasOnlyOption(optionText: string): Promise<void> {
    await this.waitForJobCategoryDropdown();
    const count = await this.page.evaluate((text) => {
      const opts = document.querySelectorAll('.selectize-dropdown .option, .selectize-dropdown [data-selectable]');
      return Array.from(opts).filter((o) => (o as HTMLElement).offsetParent !== null && (o.textContent || '').trim() === text).length;
    }, optionText);
    expect(count).toBe(1);
  }

  /**
   * Select an option from Job Category dropdown by exact text (clicks the visible option)
   * Uses Playwright locator for more reliable clicking
   */
  async selectJobCategoryOption(optionText: string): Promise<void> {
    // Wait for dropdown to appear first
    await this.waitForJobCategoryDropdown();
    
    // Find option by exact text match (case-insensitive)
    const option = this.page.locator('.selectize-dropdown .option, .selectize-dropdown [data-selectable]')
      .filter({ hasText: new RegExp(`^${optionText}$`, 'i') })
      .first();
    
    await option.waitFor({ state: 'attached', timeout: 5000 });
    await option.click({ force: true });
  }

  /**
   * Type text in the Job Location (Choose a region) selectize field (opens dropdown with regions)
   */
  async typeJobLocation(text: string): Promise<void> {
    await this.jobLocationSelectizeInput.click({ force: true });
    await this.page.waitForTimeout(300);
    await this.jobLocationSelectizeInput.fill(text);
  }

  /**
   * Get all selectize dropdown options for Job Location
   * Returns locator for all options in the dropdown
   */
  getJobLocationDropdownOptions(): Locator {
    return this.selectizeDropdownOption;
  }

  /**
   * Wait for Job Location dropdown options to appear
   */
  async waitForJobLocationDropdown(): Promise<void> {
    await this.selectizeDropdownOption.first().waitFor({ state: 'attached', timeout: 8000 });
  }

  /**
   * Verify that only one option with specific text appears in Job Location dropdown (visible options only)
   */
  async verifyJobLocationDropdownHasOnlyOption(optionText: string): Promise<void> {
    await this.waitForJobLocationDropdown();
    const count = await this.page.evaluate((text) => {
      const opts = document.querySelectorAll('.selectize-dropdown .option, .selectize-dropdown [data-selectable]');
      return Array.from(opts).filter((o) => (o as HTMLElement).offsetParent !== null && (o.textContent || '').trim() === text).length;
    }, optionText);
    expect(count).toBe(1);
  }

  /**
   * Select an option from Job Location dropdown by exact text (clicks the visible option)
   * Uses Playwright locator for more reliable clicking
   */
  async selectJobLocationOption(optionText: string): Promise<void> {
    // Wait for dropdown to appear first
    await this.waitForJobLocationDropdown();
    
    // Find option by exact text match (case-insensitive)
    const option = this.page.locator('.selectize-dropdown .option, .selectize-dropdown [data-selectable]')
      .filter({ hasText: new RegExp(`^${optionText}$`, 'i') })
      .first();
    
    await option.waitFor({ state: 'attached', timeout: 5000 });
    await option.click({ force: true });
  }

  /**
   * Wait for Job Area selectize field to become clickable/enabled
   * This field becomes active after Region is selected
   * Returns true when field becomes clickable, false if timeout
   */
  async waitForJobAreaFieldToBecomeClickable(timeoutMs: number = 10000): Promise<boolean> {
    const control = this.page.locator('.selectize-control.AreaIDSelectize').first();
    
    try {
      await control.waitFor({ state: 'attached', timeout: 5000 });
    } catch {
      return false;
    }
    
    const startTime = Date.now();
    const maxAttempts = Math.ceil(timeoutMs / 200);
    
    // Poll to check if field becomes clickable (waits until it's enabled)
    for (let i = 0; i < maxAttempts; i++) {
      const isClickable = await control.evaluate((el) => {
        // Check if control is disabled
        const isDisabled = el.classList.contains('disabled');
        if (isDisabled) return false;
        
        const input = el.querySelector('.selectize-input') as HTMLElement;
        if (!input) return false;
        
        // Check if input is disabled
        const isInputDisabled = input.classList.contains('disabled');
        // Check if input is visible
        const isVisible = input.offsetParent !== null;
        
        return !isInputDisabled && isVisible;
      });
      
      if (isClickable) {
        return true;
      }
      
      // Check timeout
      if (Date.now() - startTime > timeoutMs) {
        return false;
      }
      
      // Wait a bit before next check
      await this.page.waitForTimeout(200);
    }
    
    return false;
  }

  /**
   * Check if Job Area selectize field is clickable/enabled
   * @deprecated Use waitForJobAreaFieldToBecomeClickable instead
   */
  async isJobAreaFieldClickable(): Promise<boolean> {
    return await this.waitForJobAreaFieldToBecomeClickable(5000);
  }

  /**
   * Click on Job Area selectize field
   */
  async clickJobAreaField(): Promise<void> {
    await this.jobAreaSelectizeInput.click({ force: true });
    await this.page.waitForTimeout(500);
    // Wait for dropdown to appear after clicking
    await this.selectizeDropdownOption.first().waitFor({ state: 'attached', timeout: 5000 });
  }

  /**
   * Select an option from Job Area dropdown by exact text (clicks the visible option)
   * Uses Playwright locator for more reliable clicking
   */
  async selectJobAreaOption(optionText: string): Promise<void> {
    // Wait a bit for dropdown to fully populate
    await this.page.waitForTimeout(500);
    
    // Find option by exact text match (case-insensitive)
    const option = this.page.locator('.selectize-dropdown .option, .selectize-dropdown [data-selectable]')
      .filter({ hasText: new RegExp(`^${optionText}$`, 'i') })
      .first();
    
    // Wait for option to be available (with longer timeout as options may load dynamically)
    await option.waitFor({ state: 'attached', timeout: 10000 });
    await option.click({ force: true });
  }

  /**
   * Wait for Job Suburb selectize field to become clickable/enabled
   * This field becomes active after Area is selected
   * Returns true when field becomes clickable, false if timeout
   */
  async waitForJobSuburbFieldToBecomeClickable(timeoutMs: number = 10000): Promise<boolean> {
    const control = this.page.locator('.selectize-control.SuburbAreaIDSelectize').first();
    
    try {
      await control.waitFor({ state: 'attached', timeout: 5000 });
    } catch {
      return false;
    }
    
    const startTime = Date.now();
    const maxAttempts = Math.ceil(timeoutMs / 200);
    
    // Poll to check if field becomes clickable (waits until it's enabled)
    for (let i = 0; i < maxAttempts; i++) {
      const isClickable = await control.evaluate((el) => {
        // Check if control is disabled
        const isDisabled = el.classList.contains('disabled');
        if (isDisabled) return false;
        
        const input = el.querySelector('.selectize-input') as HTMLElement;
        if (!input) return false;
        
        // Check if input is disabled
        const isInputDisabled = input.classList.contains('disabled');
        // Check if input is visible
        const isVisible = input.offsetParent !== null;
        
        return !isInputDisabled && isVisible;
      });
      
      if (isClickable) {
        return true;
      }
      
      // Check timeout
      if (Date.now() - startTime > timeoutMs) {
        return false;
      }
      
      // Wait a bit before next check
      await this.page.waitForTimeout(200);
    }
    
    return false;
  }

  /**
   * Check if Job Suburb selectize field is clickable/enabled
   * @deprecated Use waitForJobSuburbFieldToBecomeClickable instead
   */
  async isJobSuburbFieldClickable(): Promise<boolean> {
    return await this.waitForJobSuburbFieldToBecomeClickable(5000);
  }

  /**
   * Click on Job Suburb selectize field
   */
  async clickJobSuburbField(): Promise<void> {
    await this.jobSuburbSelectizeInput.click({ force: true });
    await this.page.waitForTimeout(500);
    // Wait for dropdown to appear after clicking
    await this.selectizeDropdownOption.first().waitFor({ state: 'attached', timeout: 5000 });
  }

  /**
   * Select an option from Job Suburb dropdown by exact text (clicks the visible option)
   * Uses Playwright locator for more reliable clicking
   */
  async selectJobSuburbOption(optionText: string): Promise<void> {
    // Wait a bit for dropdown to fully populate
    await this.page.waitForTimeout(500);
    
    // Find option by exact text match (case-insensitive)
    const option = this.page.locator('.selectize-dropdown .option, .selectize-dropdown [data-selectable]')
      .filter({ hasText: new RegExp(`^${optionText}$`, 'i') })
      .first();
    
    // Wait for option to be available (with longer timeout as options may load dynamically)
    await option.waitFor({ state: 'attached', timeout: 10000 });
    await option.click({ force: true });
  }

  /**
   * Click the Submit button
   */
  async clickSubmit(): Promise<void> {
    await this.submitButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.submitButton.click();
  }

  /**
   * Wait for job view page to load (after submission)
   * URL pattern: /new/jobs/index/view/id/{id}
   */
  async waitForJobViewPage(): Promise<void> {
    await this.page.waitForURL(/.*\/new\/jobs\/index\/view\/id\/\d+/, { timeout: 15000 });
    await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    await this.jobViewPageHeading.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Verify that job view page URL matches expected pattern
   */
  async verifyJobViewPageUrl(): Promise<void> {
    await expect(this.page).toHaveURL(/.*\/new\/jobs\/index\/view\/id\/\d+/);
  }

  /**
   * Get the job title from the job view page heading
   */
  async getJobViewPageTitle(): Promise<string | null> {
    await this.jobViewPageHeading.waitFor({ state: 'visible', timeout: 10000 });
    return await this.jobViewPageHeading.textContent();
  }
}
