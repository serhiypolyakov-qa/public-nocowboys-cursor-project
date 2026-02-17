import { Page, Locator } from '@playwright/test';
import { BusinessDashboardBasePage } from './BusinessDashboardBasePage';

/**
 * Page Object for Business "Pay Here" dashboard tab.
 * One page = one class. Displays "Account Status" and "Make a payment".
 */
export class BusinessPayHerePage extends BusinessDashboardBasePage {
  readonly accountStatusHeading: Locator;
  readonly makeAPaymentText: Locator;

  constructor(page: Page) {
    super(page);
    this.accountStatusHeading = page.getByRole('heading', {
      name: /Account Status/i,
    });
    this.makeAPaymentText = page.getByText(/Make a payment/i);
  }

  async waitForPage(): Promise<void> {
    await this.accountStatusHeading.waitFor({ state: 'visible', timeout: 10000 });
    await this.makeAPaymentText.waitFor({ state: 'visible', timeout: 10000 });
  }
}
