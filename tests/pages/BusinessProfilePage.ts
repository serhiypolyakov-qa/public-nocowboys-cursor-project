import { Page, Locator } from '@playwright/test';
import { BusinessDashboardBasePage } from './BusinessDashboardBasePage';

/**
 * Page Object for Business Profile section (dashboard tab "Business Profile").
 * One page = one class.
 */
export class BusinessProfilePage extends BusinessDashboardBasePage {
  readonly yourBusinessProfileHeading: Locator;
  readonly businessProfileSubTabs: Locator;

  constructor(page: Page) {
    super(page);
    this.yourBusinessProfileHeading = page.getByRole('heading', {
      name: 'Your Business Profile',
      exact: true,
    });
    this.businessProfileSubTabs = page
      .locator('div.main-content')
      .filter({ has: this.yourBusinessProfileHeading })
      .locator('ul[class*="section-sub-nav"] li a');
  }

  async waitForPage(): Promise<void> {
    await this.yourBusinessProfileHeading.waitFor({ state: 'visible', timeout: 10000 });
  }

  async getBusinessProfileSubTabTexts(): Promise<string[]> {
    const count = await this.businessProfileSubTabs.count();
    const texts: string[] = [];
    for (let i = 0; i < count; i++) {
      const t = await this.businessProfileSubTabs.nth(i).textContent();
      if (t) texts.push(t.trim());
    }
    return texts;
  }
}
