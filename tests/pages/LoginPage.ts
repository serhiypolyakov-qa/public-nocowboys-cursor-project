import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Login Page
 * Handles navigation to signup page from login page
 */
export class LoginPage {
  readonly page: Page;
  
  // Navigation locator (using role-based selector with text)
  readonly signupLink: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Signup link - using role-based selector with text from HTML: <a href="/customers/register">Sign up.</a>
    this.signupLink = page.getByRole('link', { name: 'Sign up.' });
  }

  /**
   * Click the Signup link
   */
  async clickSignup(): Promise<void> {
    await this.signupLink.click();
  }
}
