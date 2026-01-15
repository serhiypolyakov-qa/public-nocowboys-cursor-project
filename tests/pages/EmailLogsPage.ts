import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Email Logs Page
 * Handles navigation and interaction with email logs for development/testing
 */
export class EmailLogsPage {
  readonly page: Page;

  // Email log container
  readonly emailLogContainer: Locator;
  
  // Email links locator
  readonly emailLinks: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Email log container - using stable ID selector from HTML: div#developerStatus
    this.emailLogContainer = page.locator('#developerStatus');
    
    // Email links - all links in the email log container
    // HTML: <a href="/development/view-email?file=..." target="_blank">...</a>
    this.emailLinks = this.emailLogContainer.locator('a[href*="/development/view-email"]');
  }

  /**
   * Navigate to the email logs page
   */
  async goto(): Promise<void> {
    await this.page.goto('/new/development/email-log');
  }

  /**
   * Find email link by criteria:
   * - Contains "email-validation-and-welcome" in the link text/href
   * - Contains email fragment in the link text/href
   * 
   * @param emailFragment - Part of the email address to search for (e.g., "cursor-test-business12345")
   * @returns Locator for the matching email link
   */
  findEmailValidationLink(emailFragment: string): Locator {
    // Find link that contains both "email-validation-and-welcome" and the email fragment
    // The link text format: "email@domain.com-ZendMail_...-email-validation-and-welcome.html"
    // Email in href might be URL-encoded (e.g., %40 instead of @)
    // Escape special regex characters in emailFragment
    const escapedFragment = emailFragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Create a regex pattern that matches both criteria (order doesn't matter)
    const pattern = new RegExp(`(?=.*email-validation-and-welcome)(?=.*${escapedFragment})`, 'i');
    
    // Filter links by text content that matches both patterns
    return this.emailLinks.filter({ hasText: pattern }).first();
  }

  /**
   * Click on email validation link
   * Returns a promise that resolves when the new page is opened
   * 
   * @param emailFragment - Part of the email address to search for
   * @returns Promise that resolves to the new Page object
   */
  async clickEmailValidationLink(emailFragment: string): Promise<Page> {
    const emailLink = this.findEmailValidationLink(emailFragment);
    
    // Wait for the link to be visible
    await emailLink.waitFor({ state: 'visible', timeout: 10000 });
    
    // Wait for the new page to open (since target="_blank")
    const pagePromise = this.page.context().waitForEvent('page');
    
    // Click the link
    await emailLink.click();
    
    // Wait for and return the new page
    const newPage = await pagePromise;
    await newPage.waitForLoadState('networkidle');
    
    return newPage;
  }

  /**
   * Wait for email logs page to load
   */
  async waitForPageLoad(): Promise<void> {
    await this.emailLogContainer.waitFor({ state: 'visible', timeout: 10000 });
  }
}
