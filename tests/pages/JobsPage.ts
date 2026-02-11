import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Jobs Page (/new/jobs)
 * Handles elements and actions on the jobs listing page
 */
export class JobsPage {
  readonly page: Page;

  // Recent Jobs button locator
  readonly recentJobsButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Recent Jobs button - button or link that navigates to Recent Jobs page
    this.recentJobsButton = page.getByRole('button', { name: /Recent Jobs/i }).or(page.getByRole('link', { name: /Recent Jobs/i }));
  }

  /**
   * Navigate to the jobs page
   */
  async goto(): Promise<void> {
    await this.page.goto('/new/jobs');
  }

  /**
   * Wait for the jobs page to load
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForURL(/.*\/new\/jobs$/, { timeout: 15000 });
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
  }

  /**
   * Click the "Recent Jobs" button
   */
  async clickRecentJobsButton(): Promise<void> {
    await this.recentJobsButton.click();
  }
}
