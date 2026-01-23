import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Login Page
 * Handles login form actions and navigation to signup page
 */
export class LoginPage {
  readonly page: Page;
  
  // Navigation locator (using role-based selector with text)
  readonly signupLink: Locator;
  
  // Login form locators
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginSubmitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Signup link - using role-based selector with text from HTML: <a href="/customers/register">Sign up.</a>
    this.signupLink = page.getByRole('link', { name: 'Sign up.' });
    
    // Login form fields - using ID selectors for stability
    // Email input: <input type="email" name="emailAddress" id="emailAddress" ...>
    this.emailInput = page.locator('#emailAddress');
    
    // Password input: <input type="password" name="password" id="password" ...>
    this.passwordInput = page.locator('#password');
    
    // Login submit button: <input type="submit" name="login" id="login" value="Log in" ...>
    this.loginSubmitButton = page.locator('#login');
  }

  /**
   * Navigate to the login page
   */
  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  /**
   * Enter email address in the login form
   */
  async enterEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  /**
   * Enter password in the login form
   */
  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  /**
   * Click the Login submit button
   */
  async clickLoginSubmit(): Promise<void> {
    await this.loginSubmitButton.click();
  }

  /**
   * Perform complete login action
   */
  async login(email: string, password: string): Promise<void> {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickLoginSubmit();
  }

  /**
   * Click the Signup link
   */
  async clickSignup(): Promise<void> {
    await this.signupLink.click();
  }
}
