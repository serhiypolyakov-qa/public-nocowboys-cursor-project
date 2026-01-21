import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Email Verification Page
 * Handles the email verification link click and verification page
 */
export class EmailVerificationPage {
  readonly page: Page;
  
  // Verification link locator (in email content)
  readonly verificationLink: Locator;
  
  // Success message locator
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Verification link - link containing verify-email path
    // DOM Path: center > table#bodyTable > tbody > tr > td#bodyCell > table.templateContainer > tbody > tr[2] > td#templateBody > table.mcnTextBlock > tbody.mcnTextBlockOuter > tr > td.mcnTextBlockInner > table.mcnTextContentContainer > tbody > tr > td.mcnTextContent > p[2] > a
    // HTML: <a href="https://staging.nocowboys.co.nz/customers/register/verify-email/uniqueCode/hsmbfjl8lg">...</a>
    // Use selector: link in table#bodyTable containing verify-email/uniqueCode/ in href
    this.verificationLink = page.locator('table#bodyTable a[href*="/customers/register/verify-email/uniqueCode/"]').first();
    
    // Success message - "Sign-up complete. Welcome to NoCowboys."
    // HTML: <h1 class="verify-email-title">Sign-up complete. Welcome to NoCowboys.</h1>
    this.successMessage = page.locator('h1.verify-email-title');
  }

  /**
   * Click on verification link in email
   * The link should contain /customers/register/verify-email/uniqueCode/
   * DOM Path: center > table#bodyTable > tbody > tr > td#bodyCell > ... > p[2] > a
   */
  async clickVerificationLink(): Promise<void> {
    // Wait for link to be visible
    await this.verificationLink.waitFor({ state: 'visible', timeout: 20000 });
    
    // Click the link - navigation will happen automatically
    await this.verificationLink.click();
  }

  /**
   * Wait for verification page to load
   */
  async waitForPageLoad(): Promise<void> {
    // Wait for success message to appear (indicates page loaded)
    await this.successMessage.waitFor({ state: 'visible', timeout: 30000 });
  }

  /**
   * Get verification link locator
   */
  getVerificationLink(): Locator {
    return this.verificationLink;
  }
}
