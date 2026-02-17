import { Page, Locator } from '@playwright/test';
import { BusinessDashboardBasePage } from './BusinessDashboardBasePage';

/**
 * Page Object for Business Account Settings section (/business/settings).
 * One page = one class. Sub-tabs (Password, Notifications, Account Status, Pay Here) are part of this page.
 */
export class BusinessAccountSettingsPage extends BusinessDashboardBasePage {
  readonly accountSettingsHeading: Locator;
  readonly accountSettingsSubTabs: Locator;
  readonly updatePasswordHeading: Locator;
  readonly notificationsPreferencesHeading: Locator;
  readonly accountStatusHeading: Locator;
  readonly makeAPaymentText: Locator;

  constructor(page: Page) {
    super(page);
    this.accountSettingsHeading = page.getByRole('heading', {
      name: /Account Settings/i,
    });
    this.accountSettingsSubTabs = page
      .locator('div.main-content')
      .filter({ has: this.accountSettingsHeading })
      .locator('ul[class*="section-sub-nav"] li a');
    this.updatePasswordHeading = page.getByRole('heading', {
      name: /Update Password/i,
    });
    this.notificationsPreferencesHeading = page.getByRole('heading', {
      name: /Notifications Preferences/i,
    });
    this.accountStatusHeading = page.getByRole('heading', {
      name: /Account Status/i,
    });
    this.makeAPaymentText = page.getByText(/Make a payment/i);
  }

  async waitForPage(): Promise<void> {
    await this.page.waitForURL(/.*\/business\/settings/, { timeout: 10000 });
    await this.accountSettingsHeading.waitFor({ state: 'visible', timeout: 10000 });
  }

  async getAccountSettingsSubTabTexts(): Promise<string[]> {
    const count = await this.accountSettingsSubTabs.count();
    const texts: string[] = [];
    for (let i = 0; i < count; i++) {
      const t = await this.accountSettingsSubTabs.nth(i).textContent();
      if (t) texts.push(t.trim());
    }
    return texts;
  }

  async clickAccountSettingsSubTab(subTabText: string): Promise<void> {
    const subTab = this.accountSettingsSubTabs
      .filter({ hasText: new RegExp(subTabText, 'i') })
      .first();
    await subTab.click();
  }
}
