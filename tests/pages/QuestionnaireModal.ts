import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Pre-Signup Questionnaire Modal
 * Encapsulates all selectors and actions for the questionnaire popup
 */
export class QuestionnaireModal {
  readonly page: Page;

  // Modal locators
  readonly modal: Locator;
  readonly modalForm: Locator;
  
  // Radio button locators (using stable name attributes)
  readonly reviewsYesRadio: Locator;
  readonly reputationYesRadio: Locator;
  readonly licensingYesRadio: Locator;
  
  // Button locators
  readonly nextButton: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Modal - using stable ID selector from HTML: div#questionnaire-modal
    this.modal = page.locator('#questionnaire-modal');
    
    // Form - using stable ID selector from HTML: form#questionnaire-form
    this.modalForm = page.locator('#questionnaire-form');
    
    // Radio buttons - using stable name and value attributes from HTML
    // HTML: <input type="radio" name="questionnaire[reviews]" value="yes" required="">
    this.reviewsYesRadio = this.modalForm.locator('input[name="questionnaire[reviews]"][value="yes"]');
    
    // HTML: <input type="radio" name="questionnaire[reputation]" value="yes" required="">
    this.reputationYesRadio = this.modalForm.locator('input[name="questionnaire[reputation]"][value="yes"]');
    
    // HTML: <input type="radio" name="questionnaire[licensing]" value="yes" required="">
    this.licensingYesRadio = this.modalForm.locator('input[name="questionnaire[licensing]"][value="yes"]');
    
    // Next button - using stable ID selector from HTML: button#questionnaire-approve-action
    this.nextButton = page.locator('#questionnaire-approve-action');
  }

  /**
   * Wait for the questionnaire modal to appear
   */
  async waitForModal(): Promise<void> {
    await this.modal.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Select "Yes, I am committed to asking for and obtaining reviews." radio button
   */
  async selectReviewsYes(): Promise<void> {
    await this.reviewsYesRadio.check();
  }

  /**
   * Select "Yes, I understand and support this approach." radio button
   */
  async selectReputationYes(): Promise<void> {
    await this.reputationYesRadio.check();
  }

  /**
   * Select "Yes, I hold a valid license where required." radio button
   */
  async selectLicensingYes(): Promise<void> {
    await this.licensingYesRadio.check();
  }

  /**
   * Fill all questionnaire fields with "Yes" answers
   */
  async fillQuestionnaireWithYes(): Promise<void> {
    await this.selectReviewsYes();
    await this.selectReputationYes();
    await this.selectLicensingYes();
  }

  /**
   * Click the Next button
   */
  async clickNext(): Promise<void> {
    await this.nextButton.waitFor({ state: 'visible' });
    await this.nextButton.click();
  }

  /**
   * Wait for the modal to disappear
   */
  async waitForModalToClose(): Promise<void> {
    await this.modal.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {
      // Modal might close immediately, continue anyway
    });
  }
}
