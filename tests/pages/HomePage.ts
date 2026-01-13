import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Home Page
 * Handles navigation to login page
 */
export class HomePage {
  readonly page: Page;
  
  // Navigation locator (using role-based selector with text)
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Login button - using role-based selector with text from HTML: <a href="/login"><span class="navbar-login-item">Log In</span></a>
    this.loginButton = page.getByRole('link', { name: 'Log In' });
  }

  /**
   * Navigate to the home page
   */
  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  /**
   * Click the Login button
   */
  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }
}
