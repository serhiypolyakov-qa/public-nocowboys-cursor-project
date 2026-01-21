import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Email Content Page
 * Handles interaction with email content (opened in new tab)
 */
export class EmailContentPage {
  readonly page: Page;

  // Email content container
  readonly emailContent: Locator;
  
  // Links in email content
  readonly emailLinks: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Email content - typically in body or a container
    // The email content is usually in the body of the page
    this.emailContent = page.locator('body');
    
    // Links in email - all links in the email content
    // Email validation links are typically anchor tags with href
    this.emailLinks = this.emailContent.locator('a[href]');
  }

  /**
   * Wait for email content to load
   */
  async waitForPageLoad(): Promise<void> {
    // Wait for page to load (use domcontentloaded instead of networkidle for faster execution)
    await this.page.waitForLoadState('domcontentloaded');
    // Wait a bit more for email content to render
    await this.page.waitForTimeout(2000);
  }

  /**
   * Find verification link in email
   * Email verification links typically contain "verify", "confirm", "validation", or similar keywords
   * Priority: links with "Confirm Email Address" text or href containing "business-account-created"
   * 
   * @returns Locator for the verification link
   */
  findVerificationLink(): Locator {
    // Priority 1: Find link with text "Confirm Email Address" (most specific)
    const confirmEmailLink = this.emailLinks.filter({ 
      hasText: /Confirm Email Address/i 
    });
    
    // Priority 2: Find link with href containing "business-account-created" or "confirm"
    const businessAccountLink = this.emailLinks.filter(
      this.page.locator('a[href*="business-account-created"], a[href*="/register/business"]')
    );
    
    // Priority 3: Find link with common verification keywords in text
    const keywordPattern = /verify|confirm|validation|activate|activate-account/i;
    const linkByText = this.emailLinks.filter({ hasText: keywordPattern });
    
    // Priority 4: Find link by href containing verification keywords
    const linkByHref = this.emailLinks.filter(
      this.page.locator('a[href*="verify"], a[href*="confirm"], a[href*="validation"], a[href*="activate"]')
    );
    
    // Return the first matching link in priority order, or fallback to first link in email
    return confirmEmailLink
      .or(businessAccountLink)
      .or(linkByText)
      .or(linkByHref)
      .first(); // Use .first() to ensure only one element is returned
  }

  /**
   * Click on verification link in email
   * Based on DOM Path: center > table#bodyTable > ... > a with text "Confirm Email Address"
   * HTML: <a href="https://staging.nocowboys.co.nz/register/business-account-created/..." target="_blank">Confirm Email Address</a>
   * 
   * @returns Promise that resolves when navigation starts
   */
  async clickVerificationLink(): Promise<void> {
    // Wait for page to fully load
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000);
    
    // Try multiple strategies to find the verification link
    let verificationLink: Locator | null = null;
    
    // Strategy 1: Link with text "Confirm Email Address" and href containing business-account-created
    try {
      verificationLink = this.page.locator('a[href*="/register/business-account-created"]')
        .filter({ hasText: /Confirm Email Address/i })
        .first();
      await verificationLink.waitFor({ state: 'visible', timeout: 5000 });
    } catch {
      // Strategy 2: Any link with text "Confirm Email Address"
      try {
        verificationLink = this.page.getByRole('link', { name: /Confirm Email Address/i }).first();
        await verificationLink.waitFor({ state: 'visible', timeout: 5000 });
      } catch {
        // Strategy 3: Link with href containing business-account-created or business-details
        try {
          verificationLink = this.page.locator('a[href*="/register/business-account-created"], a[href*="/register/business-details"]').first();
          await verificationLink.waitFor({ state: 'visible', timeout: 5000 });
        } catch {
          // Strategy 4: Any link containing verify/confirm keywords
          verificationLink = this.page.locator('a[href*="verify"], a[href*="confirm"], a[href*="validation"]').first();
          await verificationLink.waitFor({ state: 'visible', timeout: 5000 });
        }
      }
    }
    
    if (verificationLink) {
      // Click the verification link
      await verificationLink.click();
    } else {
      throw new Error('Verification link not found in email content');
    }
  }

  /**
   * Get all links in the email
   * Useful for debugging or when multiple links exist
   * 
   * @returns Locator for all links
   */
  getAllLinks(): Locator {
    return this.emailLinks;
  }
}
