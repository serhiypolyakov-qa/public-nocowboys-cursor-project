import { Page, Locator } from '@playwright/test';

/**
 * Base Page Object for Business Dashboard layout.
 * Contains shared elements present on every business dashboard section: business name and main nav tabs.
 * One page = one class: each dashboard section has its own page class extending this base.
 */
export class BusinessDashboardBasePage {
  readonly page: Page;
  readonly businessNameHeading: Locator;
  readonly businessProfileTab: Locator;
  readonly ratingsTab: Locator;
  readonly badgesTab: Locator;
  readonly messagesTab: Locator;
  readonly jobsTab: Locator;
  readonly supportTab: Locator;
  readonly conversationsTab: Locator;
  readonly accountSettingsTab: Locator;
  readonly payHereTab: Locator;

  constructor(page: Page) {
    this.page = page;

    this.businessNameHeading = page.locator(
      'div.main-content section[class*="container-business-personal"] div.container.title-bar h1'
    );
    this.businessProfileTab = page
      .locator('div.main-content section[class*="container-business-personal"] ul.nav-tabs li div.nav-tab-content')
      .filter({ hasText: 'Business Profile' })
      .first();
    this.ratingsTab = page
      .locator('div.main-content section[class*="container-business-personal"] ul.nav-tabs li div.nav-tab-content')
      .filter({ hasText: 'Ratings' })
      .first();
    this.badgesTab = page
      .locator('div.main-content section[class*="container-business-personal"] ul.nav-tabs li div.nav-tab-content')
      .filter({ hasText: 'Badges' })
      .first();
    this.messagesTab = page
      .locator('div.main-content section[class*="container-business-personal"] ul.nav-tabs li div.nav-tab-content')
      .filter({ hasText: 'Messages' })
      .first();
    this.jobsTab = page
      .locator('div.main-content section[class*="container-business-personal"] ul.nav-tabs li div.nav-tab-content')
      .filter({ hasText: 'Jobs' })
      .first();
    this.supportTab = page
      .locator('div.main-content section[class*="container-business-personal"] ul.nav-tabs li div.nav-tab-content')
      .filter({ hasText: 'Support' })
      .first();
    this.conversationsTab = page
      .locator('div.main-content section[class*="container-business-personal"] ul.nav-tabs li div.nav-tab-content')
      .filter({ hasText: 'Conversations' })
      .first();
    this.accountSettingsTab = page
      .locator('div.main-content section[class*="container-business-personal"] ul.nav-tabs li div.nav-tab-content')
      .filter({ hasText: 'Account Settings' })
      .first();
    this.payHereTab = page
      .locator('div.main-content section[class*="container-business-personal"] ul.nav-tabs li div.nav-tab-content')
      .filter({ hasText: 'Pay Here' })
      .first();
  }

  async getBusinessName(): Promise<string | null> {
    return await this.businessNameHeading.textContent();
  }

  async clickBusinessProfileTab(): Promise<void> {
    await this.businessProfileTab.click();
  }

  async clickRatingsTab(): Promise<void> {
    await this.ratingsTab.click();
  }

  async clickBadgesTab(): Promise<void> {
    await this.badgesTab.click();
  }

  async clickMessagesTab(): Promise<void> {
    await this.messagesTab.click();
  }

  async clickJobsTab(): Promise<void> {
    await this.jobsTab.click();
  }

  async clickSupportTab(): Promise<void> {
    await this.supportTab.click();
  }

  async clickConversationsTab(): Promise<void> {
    await this.conversationsTab.click();
  }

  async clickAccountSettingsTab(): Promise<void> {
    await this.accountSettingsTab.click();
  }

  async clickPayHereTab(): Promise<void> {
    await this.payHereTab.click();
  }
}
