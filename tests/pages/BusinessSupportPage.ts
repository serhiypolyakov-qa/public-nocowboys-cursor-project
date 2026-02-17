import { Page, Locator } from '@playwright/test';
import { BusinessDashboardBasePage } from './BusinessDashboardBasePage';

/**
 * Page Object for Business Support section (/business/support).
 * One page = one class.
 */
export class BusinessSupportPage extends BusinessDashboardBasePage {
  readonly supportHeading: Locator;
  readonly supportSubTabs: Locator;

  constructor(page: Page) {
    super(page);
    this.supportHeading = page.getByRole('heading', { name: 'Support', exact: true });
    this.supportSubTabs = page
      .locator('div.main-content')
      .filter({ has: this.supportHeading })
      .locator('ul[class*="section-sub-nav"] li a');
  }

  async waitForPage(): Promise<void> {
    await this.page.waitForURL(/.*\/business\/support/, { timeout: 10000 });
    await this.supportHeading.waitFor({ state: 'visible', timeout: 10000 });
  }

  async getSupportSubTabTexts(): Promise<string[]> {
    const count = await this.supportSubTabs.count();
    const texts: string[] = [];
    for (let i = 0; i < count; i++) {
      const t = await this.supportSubTabs.nth(i).textContent();
      if (t) texts.push(t.trim());
    }
    return texts;
  }
}
