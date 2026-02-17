import { Page, Locator } from '@playwright/test';
import { BusinessDashboardBasePage } from './BusinessDashboardBasePage';

/**
 * Page Object for Business Ratings section (/business/ratings).
 * One page = one class.
 */
export class BusinessRatingsPage extends BusinessDashboardBasePage {
  readonly ratingsHeading: Locator;
  readonly ratingsSubTabs: Locator;

  constructor(page: Page) {
    super(page);
    this.ratingsHeading = page.getByRole('heading', { name: /Ratings/i });
    this.ratingsSubTabs = page
      .locator('div.main-content')
      .filter({ has: this.ratingsHeading })
      .locator('ul[class*="section-sub-nav"] li a');
  }

  async waitForPage(): Promise<void> {
    await this.page.waitForURL(/.*\/business\/ratings/, { timeout: 10000 });
    await this.ratingsHeading.waitFor({ state: 'visible', timeout: 10000 });
  }

  async getRatingsSubTabTexts(): Promise<string[]> {
    const count = await this.ratingsSubTabs.count();
    const texts: string[] = [];
    for (let i = 0; i < count; i++) {
      const t = await this.ratingsSubTabs.nth(i).textContent();
      if (t) texts.push(t.trim());
    }
    return texts;
  }
}
