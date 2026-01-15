import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Business Signup Page
 * Encapsulates all selectors and actions for the business registration form
 */
export class BusinessSignupPage {
  readonly page: Page;

  // Form locators
  readonly form: Locator;
  
  // Input field locators (using stable ID attributes)
  readonly businessNameInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly mainPhoneCodeInput: Locator;
  readonly mainPhoneInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  
  // Checkbox locators
  readonly confirmQuestionnaireCheckbox: Locator;
  
  // Button locators
  readonly confirmButton: Locator;
  
  // Validation checkmark locators (green checkmarks)
  readonly validationCheckmarks: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Form - using stable ID selector from HTML: form#register-business-details-form
    this.form = page.locator('#register-business-details-form');
    
    // Input fields - using stable ID selectors from HTML
    this.businessNameInput = page.locator('#CompanyName');
    this.firstNameInput = page.locator('#Name');
    this.lastNameInput = page.locator('#lastName');
    this.mainPhoneCodeInput = page.locator('#mainPhoneCode');
    this.mainPhoneInput = page.locator('#mainPhone');
    this.emailInput = page.locator('#Username');
    this.passwordInput = page.locator('#password');
    this.confirmPasswordInput = page.locator('#confirmPassword');
    
    // Checkbox - using stable ID selector from HTML: input#confirmQuestionnaire
    this.confirmQuestionnaireCheckbox = page.locator('#confirmQuestionnaire');
    
    // Confirm button - using stable ID selector from HTML: input#addBusiness
    this.confirmButton = page.locator('#addBusiness');
    
    // Validation checkmarks - green checkmarks next to validated fields
    // HTML: <span class="icon-valid icon-validation material-icons">check_circle</span>
    this.validationCheckmarks = this.form.locator('span.icon-valid.icon-validation.material-icons');
  }

  /**
   * Navigate to the business signup page
   */
  async goto(): Promise<void> {
    await this.page.goto('/register/business');
  }

  /**
   * Fill the business name field
   */
  async fillBusinessName(businessName: string): Promise<void> {
    await this.businessNameInput.click();
    await this.businessNameInput.fill(businessName);
    await this.businessNameInput.blur();
    // Wait for validation to complete and checkmark to appear
    await this.page.waitForTimeout(1000);
    // Wait for checkmark to become visible
    const checkmark = this.getBusinessNameCheckmark();
    await checkmark.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
      // If checkmark doesn't appear, wait a bit more
    });
  }

  /**
   * Get validation checkmark for business name field
   */
  getBusinessNameCheckmark(): Locator {
    // The checkmark appears next to the business name field
    // Find the form-group containing the input, then find the checkmark within it
    return this.form.locator(`div.form-group:has(#CompanyName)`).locator('span.icon-valid.icon-validation.material-icons');
  }

  /**
   * Fill the first name field
   */
  async fillFirstName(firstName: string): Promise<void> {
    await this.firstNameInput.click();
    await this.firstNameInput.fill(firstName);
    await this.firstNameInput.blur();
    await this.page.waitForTimeout(500); // Wait for validation
  }

  /**
   * Fill the last name field
   */
  async fillLastName(lastName: string): Promise<void> {
    await this.lastNameInput.click();
    await this.lastNameInput.fill(lastName);
    await this.lastNameInput.blur();
    // Wait for validation to complete and checkmark to appear
    await this.page.waitForTimeout(1000);
    // Wait for checkmark to become visible
    const checkmark = this.getLastNameCheckmark();
    await checkmark.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
      // If checkmark doesn't appear, wait a bit more
    });
  }

  /**
   * Get validation checkmark for last name field
   */
  getLastNameCheckmark(): Locator {
    // The checkmark appears next to the last name field
    // Find the form-group containing the input, then find the checkmark within it
    return this.form.locator(`div.form-group:has(#lastName)`).locator('span.icon-valid.icon-validation.material-icons');
  }

  /**
   * Fill the phone code field
   */
  async fillMainPhoneCode(phoneCode: string): Promise<void> {
    await this.mainPhoneCodeInput.click();
    await this.mainPhoneCodeInput.fill(phoneCode);
    await this.mainPhoneCodeInput.blur();
    await this.page.waitForTimeout(500); // Wait for validation
  }

  /**
   * Fill the phone number field
   */
  async fillMainPhone(phoneNumber: string): Promise<void> {
    await this.mainPhoneInput.click();
    await this.mainPhoneInput.fill(phoneNumber);
    await this.mainPhoneInput.blur();
    // Wait for validation to complete and checkmark to appear
    await this.page.waitForTimeout(1000);
    // Wait for checkmark to become visible
    const checkmark = this.getMainPhoneCheckmark();
    await checkmark.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
      // If checkmark doesn't appear, wait a bit more
    });
  }

  /**
   * Get validation checkmark for main phone field
   */
  getMainPhoneCheckmark(): Locator {
    // The checkmark appears next to the main phone field
    // Find the form-group containing the input, then find the checkmark within it
    return this.form.locator(`div.form-group:has(#mainPhone)`).locator('span.icon-valid.icon-validation.material-icons');
  }

  /**
   * Fill the email address field
   */
  async fillEmail(email: string): Promise<void> {
    await this.emailInput.click();
    await this.emailInput.fill(email);
    await this.emailInput.blur();
    // Wait for validation to complete and checkmark to appear
    await this.page.waitForTimeout(1000);
    // Wait for checkmark to become visible
    const checkmark = this.getEmailCheckmark();
    await checkmark.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
      // If checkmark doesn't appear, wait a bit more
    });
  }

  /**
   * Get validation checkmark for email field
   */
  getEmailCheckmark(): Locator {
    // The checkmark appears next to the email field
    // Find the form-group containing the input, then find the checkmark within it
    return this.form.locator(`div.form-group:has(#Username)`).locator('span.icon-valid.icon-validation.material-icons');
  }

  /**
   * Fill the password field
   */
  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.click();
    await this.passwordInput.fill(password);
    await this.passwordInput.blur();
    // Wait for validation to complete and checkmark to appear
    await this.page.waitForTimeout(1000);
    // Wait for checkmark to become visible
    const checkmark = this.getPasswordCheckmark();
    await checkmark.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
      // If checkmark doesn't appear, wait a bit more
    });
  }

  /**
   * Get validation checkmark for password field
   */
  getPasswordCheckmark(): Locator {
    // The checkmark appears next to the password field
    // Find the form-group containing the input, then find the checkmark within it
    return this.form.locator(`div.form-group:has(#password)`).locator('span.icon-valid.icon-validation.material-icons');
  }

  /**
   * Fill the confirm password field
   */
  async fillConfirmPassword(password: string): Promise<void> {
    await this.confirmPasswordInput.click();
    await this.confirmPasswordInput.fill(password);
    await this.confirmPasswordInput.blur();
    // Wait for validation to complete and checkmark to appear
    await this.page.waitForTimeout(1000);
    // Wait for checkmark to become visible
    const checkmark = this.getConfirmPasswordCheckmark();
    await checkmark.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
      // If checkmark doesn't appear, wait a bit more
    });
  }

  /**
   * Get validation checkmark for confirm password field
   */
  getConfirmPasswordCheckmark(): Locator {
    // The checkmark appears next to the confirm password field
    // Find the form-group containing the input, then find the checkmark within it
    return this.form.locator(`div.form-group:has(#confirmPassword)`).locator('span.icon-valid.icon-validation.material-icons');
  }

  /**
   * Check the confirmation questionnaire checkbox
   */
  async checkConfirmQuestionnaire(): Promise<void> {
    await this.confirmQuestionnaireCheckbox.check();
  }

  /**
   * Check if the confirm button is clickable (enabled)
   */
  async isConfirmButtonClickable(): Promise<boolean> {
    await this.confirmButton.waitFor({ state: 'visible' });
    return await this.confirmButton.isEnabled();
  }

  /**
   * Click the confirm button
   * Waits for the button to be enabled before clicking
   */
  async clickConfirmButton(): Promise<void> {
    // Wait for button to be visible
    await this.confirmButton.waitFor({ state: 'visible' });
    
    // Wait for button to be enabled (form validation must pass)
    let isEnabled = await this.confirmButton.isEnabled();
    if (!isEnabled) {
      // Wait additional time for validation
      await this.page.waitForTimeout(2000);
      isEnabled = await this.confirmButton.isEnabled();
    }
    
    // Wait for button to be enabled with timeout (polling approach)
    if (!isEnabled) {
      const maxAttempts = 10;
      for (let i = 0; i < maxAttempts; i++) {
        await this.page.waitForTimeout(500);
        isEnabled = await this.confirmButton.isEnabled();
        if (isEnabled) break;
      }
    }
    
    // Click the confirm button
    await this.confirmButton.click({ force: !isEnabled });
  }

  /**
   * Fill the entire business registration form
   * Clicks on each field before filling and waits for validation after each field
   */
  async fillRegistrationForm(data: {
    businessName: string;
    firstName: string;
    lastName: string;
    phoneCode: string;
    phoneNumber: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): Promise<void> {
    // Fill business name
    await this.fillBusinessName(data.businessName);
    
    // Fill first name
    await this.fillFirstName(data.firstName);
    
    // Fill last name
    await this.fillLastName(data.lastName);
    
    // Fill phone code
    await this.fillMainPhoneCode(data.phoneCode);
    
    // Fill phone number
    await this.fillMainPhone(data.phoneNumber);
    
    // Fill email
    await this.fillEmail(data.email);
    
    // Fill password
    await this.fillPassword(data.password);
    
    // Fill confirm password
    await this.fillConfirmPassword(data.confirmPassword);
    
    // Wait for all form validation to complete
    await this.page.waitForTimeout(2000);
  }
}
