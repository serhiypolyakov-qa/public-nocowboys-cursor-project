import { test, expect, Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { CustomerSignupPage } from '../pages/CustomerSignupPage';
import { BusinessSignupPage } from '../pages/BusinessSignupPage';
import { QuestionnaireModal } from '../pages/QuestionnaireModal';
import { BusinessAccountCreatedPage } from '../pages/BusinessAccountCreatedPage';
import { EmailLogsPage } from '../pages/EmailLogsPage';
import { EmailContentPage } from '../pages/EmailContentPage';
import { BusinessDetailsPage } from '../pages/BusinessDetailsPage';

/**
 * Manual Test Case: BusinessRegistrationTest
 * 
 * Test Steps:
 * 1. Перейди на https://staging.nocowboys.co.nz (for base Authorization use HTTP_AUTH_USERNAME and HTTP_AUTH_PASSWORD from .env)
 * 2. Click Login button on Home page
 * 3. Click Sign up link on Login page
 * 4. Click Business Account link
 * 5. Fill Business name field with "CursorTestBusiness" + random 4-digit number
 * 6. Verify green checkmark appears next to Business name field
 * 7. Fill Primary contact first name field with "Serhii"
 * 8. Fill Last name field with "Bususer"
 * 9. Verify green checkmark appears next to Last name field
 * 10. Fill Main Phone Code field with "123"
 * 11. Fill Primary contact phone number field with "1112233"
 * 12. Verify green checkmark appears next to Primary contact phone number field
 * 13. Fill Business email address field with "cursor-test-business@greenice.net" + random 5-digit number
 * 14. Verify green checkmark appears next to Business email address field
 * 15. Fill Password field with "password123"
 * 16. Verify green checkmark appears next to Password field
 * 17. Fill Retype the password field with "password123"
 * 18. Verify green checkmark appears next to Retype password field
 * 19. Check "I confirm that I have answered all questions truthfully" checkbox
 * 20. On Pre-Signup Questionnaire popup, select "Yes, I am committed to asking for and obtaining reviews." radio button
 * 21. On Pre-Signup Questionnaire popup, select "Yes, I understand and support this approach." radio button
 * 22. On Pre-Signup Questionnaire popup, select "Yes, I hold a valid license where required." radio button
 * 23. Click Next button on Pre-Signup Questionnaire popup
 * 24. Verify that "Confirm my email address" button is clickable
 * 25. Click "Confirm my email address" button
 * 26. Verify that Account Successfully Created page is displayed with URL containing "/register/business-account-created/" and message "Account Successfully Created"
 * 27. Navigate to email logs page (https://staging.nocowboys.co.nz/new/development/email-log)
 * 28. Click on email link that contains "email-validation-and-welcome" and email fragment from step 13
 * 29. Click on verification link in the email content
 * 30. Verify that Business Details page is displayed with URL containing "/register/business-details/" and message "About your Business"
 */
test.describe('Business Registration', () => {
  test('BusinessRegistrationTest - should successfully create business account', async ({ page }) => {
    // Increase test timeout for email verification steps
    test.setTimeout(120000); // 2 minutes
    // Arrange
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const customerSignupPage = new CustomerSignupPage(page);
    const businessSignupPage = new BusinessSignupPage(page);
    const questionnaireModal = new QuestionnaireModal(page);
    const businessAccountCreatedPage = new BusinessAccountCreatedPage(page);
    const emailLogsPage = new EmailLogsPage(page);
    const businessDetailsPage = new BusinessDetailsPage(page);

    // Generate unique business name with random 4-digit number
    const randomBusinessNumber = Math.floor(1000 + Math.random() * 9000); // 4-digit number (1000-9999)
    const uniqueBusinessName = `CursorTestBusiness${randomBusinessNumber}`;

    // Generate unique email with random 5-digit number
    const randomEmailNumber = Math.floor(10000 + Math.random() * 90000); // 5-digit number (10000-99999)
    const uniqueEmail = `cursor-test-business${randomEmailNumber}@greenice.net`;

    const testData = {
      businessName: uniqueBusinessName,
      firstName: 'Serhii',
      lastName: 'Bususer',
      phoneCode: '123',
      phoneNumber: '1112233',
      email: uniqueEmail,
      password: 'password123',
      confirmPassword: 'password123',
    };

    // Act - Step 1: Navigate to home page (base Authorization configured in playwright.config.ts)
    await homePage.goto();

    // Act - Step 2: Click Login button on Home page
    await homePage.clickLogin();

    // Act - Step 3: Click Sign up link on Login page
    await loginPage.clickSignup();

    // Act - Step 4: Click Business Account link
    await customerSignupPage.clickBusinessAccount();

    // Act - Step 5: Fill Business name field
    await businessSignupPage.fillBusinessName(testData.businessName);

    // Assert - Step 6: Verify green checkmark appears next to Business name field
    const businessNameCheckmark = businessSignupPage.getBusinessNameCheckmark();
    await expect(businessNameCheckmark).toBeVisible();

    // Act - Step 7: Fill Primary contact first name field
    await businessSignupPage.fillFirstName(testData.firstName);

    // Act - Step 8: Fill Last name field
    await businessSignupPage.fillLastName(testData.lastName);

    // Assert - Step 9: Verify green checkmark appears next to Last name field
    const lastNameCheckmark = businessSignupPage.getLastNameCheckmark();
    await expect(lastNameCheckmark).toBeVisible();

    // Act - Step 10: Fill Main Phone Code field
    await businessSignupPage.fillMainPhoneCode(testData.phoneCode);

    // Act - Step 11: Fill Primary contact phone number field
    await businessSignupPage.fillMainPhone(testData.phoneNumber);

    // Assert - Step 12: Verify green checkmark appears next to Primary contact phone number field
    const mainPhoneCheckmark = businessSignupPage.getMainPhoneCheckmark();
    await expect(mainPhoneCheckmark).toBeVisible();

    // Act - Step 13: Fill Business email address field
    await businessSignupPage.fillEmail(testData.email);

    // Assert - Step 14: Verify green checkmark appears next to Business email address field
    const emailCheckmark = businessSignupPage.getEmailCheckmark();
    await expect(emailCheckmark).toBeVisible();

    // Act - Step 15: Fill Password field
    await businessSignupPage.fillPassword(testData.password);

    // Assert - Step 16: Verify green checkmark appears next to Password field
    const passwordCheckmark = businessSignupPage.getPasswordCheckmark();
    await expect(passwordCheckmark).toBeVisible();

    // Act - Step 17: Fill Retype the password field
    await businessSignupPage.fillConfirmPassword(testData.confirmPassword);

    // Assert - Step 18: Verify green checkmark appears next to Retype password field
    const confirmPasswordCheckmark = businessSignupPage.getConfirmPasswordCheckmark();
    await expect(confirmPasswordCheckmark).toBeVisible();

    // Act - Step 19: Check "I confirm that I have answered all questions truthfully" checkbox
    await businessSignupPage.checkConfirmQuestionnaire();

    // Act - Step 20: Wait for Pre-Signup Questionnaire modal to appear and select "Yes, I am committed to asking for and obtaining reviews." radio button
    await questionnaireModal.waitForModal();
    await questionnaireModal.selectReviewsYes();

    // Act - Step 21: On Pre-Signup Questionnaire popup, select "Yes, I understand and support this approach." radio button
    await questionnaireModal.selectReputationYes();

    // Act - Step 22: On Pre-Signup Questionnaire popup, select "Yes, I hold a valid license where required." radio button
    await questionnaireModal.selectLicensingYes();

    // Act - Step 23: Click Next button on Pre-Signup Questionnaire popup
    await questionnaireModal.clickNext();
    await questionnaireModal.waitForModalToClose();

    // Wait for form to be ready after questionnaire is submitted
    await page.waitForTimeout(1000);

    // Assert - Step 24: Verify that "Confirm my email address" button is clickable
    const isConfirmButtonClickable = await businessSignupPage.isConfirmButtonClickable();
    expect(isConfirmButtonClickable).toBe(true);

    // Act - Step 25: Click "Confirm my email address" button
    await businessSignupPage.clickConfirmButton();

    // Assert - Step 26: Verify that Account Successfully Created page is displayed
    // Wait for page to load
    await businessAccountCreatedPage.waitForPageLoad();

    // Assert - Step 26: Verify URL contains "/register/business-account-created/"
    await businessAccountCreatedPage.verifyUrl();
    await expect(page).toHaveURL(/.*\/register\/business-account-created/);

    // Assert - Step 26: Verify "Account Successfully Created" message is displayed
    await expect(businessAccountCreatedPage.successMessage).toBeVisible();
    await expect(businessAccountCreatedPage.successMessage).toHaveText('Account Successfully Created');

    // Act - Step 27: Navigate to email logs page
    await emailLogsPage.goto();
    await emailLogsPage.waitForPageLoad();

    // Extract email fragment (part before @) for searching email in logs
    // Email format: cursor-test-business12345@greenice.net
    // Fragment: cursor-test-business12345
    const emailFragment = testData.email.split('@')[0];

    // Act - Step 28: Click on email link that contains "email-validation-and-welcome" and email fragment
    // This opens email in a new tab
    const emailPage = await emailLogsPage.clickEmailValidationLink(emailFragment);
    
    // Create EmailContentPage for the new page (email content)
    const emailContentPage = new EmailContentPage(emailPage);
    await emailContentPage.waitForPageLoad();

    // Act - Step 29: Click on verification link in the email content
    // The verification link might open in a new tab or navigate in the same tab
    // Set up listeners for both scenarios
    const newPagePromise = page.context().waitForEvent('page', { timeout: 5000 }).catch(() => null);
    const emailPageNavigationPromise = emailPage.waitForURL(/.*\/register\/business-details/, { timeout: 10000 }).catch(() => null);
    
    await emailContentPage.clickVerificationLink();
    
    // Wait for either a new page to open or navigation in the email page
    const [newPage, emailNavigated] = await Promise.all([
      newPagePromise,
      emailPageNavigationPromise
    ]);
    
    // Determine which page has the business details
    let targetPage: Page;
    if (newPage) {
      // New page was opened
      targetPage = newPage;
      await newPage.waitForLoadState('domcontentloaded');
      // Close the email page
      await emailPage.close();
    } else if (emailNavigated !== null) {
      // Navigation happened in email page
      targetPage = emailPage;
    } else {
      // Fallback: check if original page navigated (unlikely but possible)
      try {
        await page.waitForURL(/.*\/register\/business-details/, { timeout: 5000 });
        targetPage = page;
        await emailPage.close();
      } catch {
        // If nothing happened, assume navigation is in email page
        targetPage = emailPage;
      }
    }

    // Create BusinessDetailsPage for the target page
    const businessDetailsPageOnTarget = new BusinessDetailsPage(targetPage);

    // Assert - Step 30: Verify that Business Details page is displayed
    // Wait for page to load
    await businessDetailsPageOnTarget.waitForPageLoad();

    // Assert - Step 30: Verify URL contains "/register/business-details/"
    await businessDetailsPageOnTarget.verifyUrl();
    await expect(targetPage).toHaveURL(/.*\/register\/business-details/);

    // Assert - Step 30: Verify "About your Business" message is displayed
    await expect(businessDetailsPageOnTarget.aboutYourBusinessHeading).toBeVisible();
    await expect(businessDetailsPageOnTarget.aboutYourBusinessHeading).toContainText(/About your Business/i);

    // Output test results information
    console.log('\n========================================');
    console.log('✅ Business Registration Test Completed Successfully!');
    console.log('========================================');
    console.log(`📋 Business Name: ${testData.businessName}`);
    console.log(`📧 Business Email: ${testData.email}`);
    console.log('========================================\n');
  });
});
