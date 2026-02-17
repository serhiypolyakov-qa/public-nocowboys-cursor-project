import { Page, Locator } from '@playwright/test';
import { BusinessDashboardBasePage } from './BusinessDashboardBasePage';

/**
 * Page Object for Business Dashboard Jobs section (/business/jobs).
 * Distinct from JobsPage which is for /new/jobs. One page = one class.
 */
export class BusinessDashboardJobsPage extends BusinessDashboardBasePage {
  readonly jobsHeading: Locator;
  readonly jobsSubTabs: Locator;

  constructor(page: Page) {
    super(page);
    this.jobsHeading = page.getByRole('heading', { name: 'Jobs', exact: true });
    this.jobsSubTabs = page
      .locator('div.main-content')
      .filter({ has: this.jobsHeading })
      .locator('ul[class*="section-sub-nav"] li a');
  }

  async waitForPage(): Promise<void> {
    await this.page.waitForURL(/.*\/business\/jobs/, { timeout: 10000 });
    await this.jobsHeading.waitFor({ state: 'visible', timeout: 10000 });
  }

  async getJobsSubTabTexts(): Promise<string[]> {
    const count = await this.jobsSubTabs.count();
    const texts: string[] = [];
    for (let i = 0; i < count; i++) {
      const t = await this.jobsSubTabs.nth(i).textContent();
      if (t) texts.push(t.trim());
    }
    return texts;
  }

  async clickJobsSubTab(subTabText: string): Promise<void> {
    const subTab = this.jobsSubTabs
      .filter({ hasText: new RegExp(subTabText, 'i') })
      .first();
    await subTab.click();
  }
}
