import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Email Logs Page
 * Handles email logs page and finding verification emails
 */
export class EmailLogsPage {
  readonly page: Page;
  
  // Email list container
  readonly emailList: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Email list container - assuming there's a list/table of emails
    this.emailList = page.locator('body');
  }

  /**
   * Navigate to the email logs page
   */
  async goto(): Promise<void> {
    await this.page.goto('https://staging.nocowboys.co.nz/new/development/email-log');
  }

  /**
   * Wait for the email logs page to load
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Find and click on email that contains "validate-your-email" in subject and email fragment in content
   * DOM Path: section.container.container-main > div#developerStatus > a[1]
   * HTML: <a href="/development/view-email?file=...-validate-your-email.html" target="_blank">...</a>
   * Link format: {email}-ZendMail_{timestamp}-validate-your-email.html
   * @param subjectText - Text to search in email subject (e.g., "validate-your-email")
   * @param emailFragment - Part of the email address used during registration
   * @returns New Page object if email opens in new tab
   */
  async clickEmailWithSubjectAndFragment(subjectText: string, emailFragment: string): Promise<Page> {
    // Wait for page to load (use domcontentloaded instead of networkidle for faster execution)
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000); // Additional wait for links to render
    
    // Use the exact DOM path: section.container.container-main > div#developerStatus > a
    // Find link in #developerStatus that contains "-validate-your-email" in href
    // href format: /development/view-email?file={email}-ZendMail_{timestamp}-validate-your-email.html
    // Search for link with "-validate-your-email" pattern (with dash before)
    const emailLink = this.page.locator('div#developerStatus a[href*="/development/view-email"][href*="-validate-your-email"]').first();
    
    // Wait for link to be visible
    await emailLink.waitFor({ state: 'visible', timeout: 15000 });
    
    // Since link has target="_blank", it opens in new tab
    // Wait for new page to open
    const context = this.page.context();
    const [newPage] = await Promise.all([
      context.waitForEvent('page', { timeout: 15000 }),
      emailLink.click()
    ]);
    
    // Wait for email content to load in new page
    await newPage.waitForLoadState('domcontentloaded');
    
    return newPage;
  }

  /**
   * Click on email validation link that contains "email-validation-and-welcome" and email fragment
   * Opens email in a new page/tab
   * DOM Path: section.container.container-main > div#developerStatus > a[0]
   * HTML: <a href="/development/view-email?file={email}-ZendMail_{timestamp}-email-validation-and-welcome.html" target="_blank">...</a>
   * 
   * @param emailFragment - Part of the email address used during registration (e.g., "cursor-test-business98099")
   * @returns New Page object for the opened email
   */
  async clickEmailValidationLink(emailFragment: string): Promise<Page> {
    // Wait for page to load
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000); // Additional wait for links to render
    
    // Use the exact DOM path: section.container.container-main > div#developerStatus > a
    // Find all links in #developerStatus that contain "email-validation-and-welcome"
    const allEmailLinks = this.page.locator('div#developerStatus a[href*="/development/view-email"][href*="email-validation-and-welcome"]');
    
    // Wait for at least one link to be visible
    await allEmailLinks.first().waitFor({ state: 'visible', timeout: 15000 });
    
    const linkCount = await allEmailLinks.count();
    let targetLink: Locator | null = null;
    
    // Iterate through links to find the one matching email fragment
    // Email fragment might be URL-encoded in href (%40 for @, %2540 for double encoding)
    for (let i = 0; i < linkCount; i++) {
      const link = allEmailLinks.nth(i);
      const href = await link.getAttribute('href');
      const text = await link.textContent();
      
      // Check if href or text contains email fragment (handle URL encoding)
      // href format: /development/view-email?file=cursor-test-business98099%2540greenice.net-ZendMail_...-email-validation-and-welcome.html
      const hrefMatches = href && (
        href.includes(emailFragment) || 
        href.includes(encodeURIComponent(emailFragment)) ||
        href.includes(emailFragment.replace('@', '%40')) ||
        href.includes(emailFragment.replace('@', '%2540'))
      );
      const textMatches = text && (
        text.includes(emailFragment) || 
        text.includes(emailFragment.replace('@', '%40')) ||
        text.includes(emailFragment.replace('@', '%2540'))
      );
      
      if (hrefMatches || textMatches) {
        targetLink = link;
        break;
      }
    }
    
    if (!targetLink) {
      throw new Error(`Email link with "email-validation-and-welcome" and fragment "${emailFragment}" not found. Found ${linkCount} links with "email-validation-and-welcome".`);
    }
    
    // Wait for link to be visible
    await targetLink.waitFor({ state: 'visible', timeout: 5000 });
    
    // Get the context and wait for new page to open (since target="_blank")
    const context = this.page.context();
    const [newPage] = await Promise.all([
      context.waitForEvent('page', { timeout: 15000 }),
      targetLink.click()
    ]);
    
    // Wait for email content to load in new page
    await newPage.waitForLoadState('domcontentloaded');
    
    return newPage;
  }
}
