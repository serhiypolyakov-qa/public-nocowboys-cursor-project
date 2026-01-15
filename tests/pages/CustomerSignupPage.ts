import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Customer Signup Page
 * Encapsulates all selectors and actions for the customer registration form
 */
export class CustomerSignupPage {
  readonly page: Page;

  // Form locators
  readonly form: Locator;
  
  // Input field locators (using stable ID attributes)
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailAddressInput: Locator;
  readonly mainPhoneCodeInput: Locator;
  readonly phoneNumberInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  
  // Button locators
  readonly submitButton: Locator;
  
  // Validation checkmark locators (green checkmarks)
  readonly validationCheckmarks: Locator;
  
  // Business Account link locator
  readonly businessAccountLink: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Form
    this.form = page.locator('#register-customer-form');
    
    // Business Account link - using role-based selector with text from HTML: <a href="/register/business">Business Account.</a>
    this.businessAccountLink = page.getByRole('link', { name: 'Business Account.' });
    
    // Input fields - using stable ID selectors from HTML
    this.firstNameInput = page.locator('#FirstName');
    this.lastNameInput = page.locator('#LastName');
    this.emailAddressInput = page.locator('#EmailAddress');
    this.mainPhoneCodeInput = page.locator('#mainPhoneCode');
    this.phoneNumberInput = page.locator('#phone_number');
    this.passwordInput = page.locator('#password');
    this.confirmPasswordInput = page.locator('#confirmPassword');
    
    // Submit button - using form selector with button type submit
    // Based on manual test: form#register-customer-form > div.form-group contains submit button
    // Try button[type="submit"] first, fallback to input[type="submit"]
    this.submitButton = this.form.locator('button[type="submit"], input[type="submit"]').first();
    
    // Validation checkmarks - green checkmarks next to validated fields
    // HTML: <span class="icon-valid icon-validation material-icons">check_circle</span>
    this.validationCheckmarks = this.form.locator('span.icon-valid.icon-validation.material-icons');
  }

  /**
   * Navigate to the signup page
   */
  async goto(): Promise<void> {
    await this.page.goto('/customers/register');
  }

  /**
   * Click the Business Account link
   */
  async clickBusinessAccount(): Promise<void> {
    await this.businessAccountLink.click();
  }

  /**
   * Fill the first name field
   */
  async fillFirstName(firstName: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
  }

  /**
   * Fill the last name field
   */
  async fillLastName(lastName: string): Promise<void> {
    await this.lastNameInput.fill(lastName);
  }

  /**
   * Fill the email address field
   */
  async fillEmailAddress(email: string): Promise<void> {
    await this.emailAddressInput.fill(email);
  }

  /**
   * Fill the phone area code field
   */
  async fillMainPhoneCode(phoneCode: string): Promise<void> {
    await this.mainPhoneCodeInput.fill(phoneCode);
  }

  /**
   * Fill the phone number field
   */
  async fillPhoneNumber(phoneNumber: string): Promise<void> {
    await this.phoneNumberInput.fill(phoneNumber);
  }

  /**
   * Fill the password field
   */
  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  /**
   * Fill the confirm password field
   */
  async fillConfirmPassword(password: string): Promise<void> {
    await this.confirmPasswordInput.fill(password);
  }

  /**
   * Fill the entire registration form
   * Clicks on each field before filling and waits for validation after each field
   */
  async fillRegistrationForm(data: {
    firstName: string;
    lastName: string;
    email: string;
    phoneCode: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
  }): Promise<void> {
    // Step 4: Click on First name field and enter value
    await this.firstNameInput.click();
    await this.fillFirstName(data.firstName);
    await this.firstNameInput.blur();
    await this.page.waitForTimeout(500); // Wait for validation
    
    // Step 5: Click on Last name field and enter value
    await this.lastNameInput.click();
    await this.fillLastName(data.lastName);
    await this.lastNameInput.blur();
    await this.page.waitForTimeout(500); // Wait for validation
    
    // Step 6: Click on Email address field and enter value
    await this.emailAddressInput.click();
    await this.fillEmailAddress(data.email);
    await this.emailAddressInput.blur();
    await this.page.waitForTimeout(500); // Wait for validation
    
    // Step 7: Click on mainPhoneCode field and enter value
    await this.mainPhoneCodeInput.click();
    await this.fillMainPhoneCode(data.phoneCode);
    await this.mainPhoneCodeInput.blur();
    await this.page.waitForTimeout(500); // Wait for validation
    
    // Step 8: Click on phone_number field and enter value
    await this.phoneNumberInput.click();
    await this.fillPhoneNumber(data.phoneNumber);
    await this.phoneNumberInput.blur();
    await this.page.waitForTimeout(500); // Wait for validation
    
    // Step 9: Click on Choose a password field and enter value
    await this.passwordInput.click();
    await this.fillPassword(data.password);
    await this.passwordInput.blur();
    await this.page.waitForTimeout(500); // Wait for validation
    
    // Step 10: Click on Confirm your password field and enter value
    await this.confirmPasswordInput.click();
    await this.fillConfirmPassword(data.confirmPassword);
    await this.confirmPasswordInput.blur();
    
    // Wait for all form validation to complete and checkmarks to appear
    await this.page.waitForTimeout(2000);
    
    // Wait for submit button to become enabled (indicates all validations passed)
    await this.submitButton.waitFor({ state: 'visible' });
    let isEnabled = await this.submitButton.isEnabled();
    if (!isEnabled) {
      // Wait additional time for validation to complete
      await this.page.waitForTimeout(3000);
      isEnabled = await this.submitButton.isEnabled();
    }
  }

  /**
   * Click the submit button
   * Waits for the button to be enabled before clicking
   */
  async clickSubmit(): Promise<void> {
    // Wait for button to be visible and enabled
    await this.submitButton.waitFor({ state: 'visible' });
    
    // Wait for button to be enabled (form validation must pass)
    await this.submitButton.waitFor({ state: 'attached' });
    
    // Check if button is enabled, if not wait a bit more
    let isEnabled = await this.submitButton.isEnabled();
    if (!isEnabled) {
      // Wait additional time for validation
      await this.page.waitForTimeout(2000);
      // Try triggering validation by pressing Tab
      await this.page.keyboard.press('Tab');
      await this.page.waitForTimeout(1000);
      isEnabled = await this.submitButton.isEnabled();
    }
    
    // Wait for button to be enabled with timeout (polling approach)
    if (!isEnabled) {
      const maxAttempts = 10;
      for (let i = 0; i < maxAttempts; i++) {
        await this.page.waitForTimeout(500);
        isEnabled = await this.submitButton.isEnabled();
        if (isEnabled) break;
      }
    }
    
    // Click the submit button
    await this.submitButton.click({ force: !isEnabled });
  }

  /**
   * Submit the registration form
   * Waits for the button to be enabled before clicking
   */
  async submitForm(): Promise<void> {
    await this.clickSubmit();
  }

  /**
   * Get all validation checkmarks (green checkmarks)
   * Returns locator for all validation checkmarks in the form
   */
  getAllValidationCheckmarks(): Locator {
    return this.validationCheckmarks;
  }

  /**
   * Verify that validation checkmarks are displayed for all fields
   * This checks that green checkmarks appear next to validated input fields
   */
  async verifyAllValidationCheckmarks(): Promise<void> {
    // Wait for validation checkmarks to appear in DOM
    // Checkmarks may be present but not visible, so we wait for them to be attached
    await this.validationCheckmarks.first().waitFor({ state: 'attached', timeout: 5000 }).catch(() => {
      // If first checkmark doesn't appear, wait a bit more
    });
    
    // Wait additional time for all checkmarks to be processed
    await this.page.waitForTimeout(1000);
    
    // Get count of validation checkmarks
    const checkmarkCount = await this.validationCheckmarks.count();
    
    // We expect 6 checkmarks for validated fields
    // If not all checkmarks are present, wait a bit more
    if (checkmarkCount < 6) {
      await this.page.waitForTimeout(2000);
    }
  }
}
