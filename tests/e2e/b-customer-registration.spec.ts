import { test, expect, Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { CustomerSignupPage } from '../pages/CustomerSignupPage';
import { VerificationRequiredPage } from '../pages/VerificationRequiredPage';
import { EmailLogsPage } from '../pages/EmailLogsPage';
import { EmailVerificationPage } from '../pages/EmailVerificationPage';

/**
 * С
 * 
 * Manual Test Case: CustomerRegistrationTest
 * 
 * Test Steps:
 * 1. Перейди на https://staging.nocowboys.co.nz (for base Authorization use HTTP_AUTH_USERNAME and HTTP_AUTH_PASSWORD from .env)
 * 2. Click Login button on Home page
 * 3. Click Signup link on Login page
 * 4. Click on First name field and enter Serhiy
 * 5. Click on Last name field and enter Coursor-Test
 * 6. Click on Email address field and enter email (with randomizer)
 * 7. Click on mainPhoneCode field and enter 123
 * 8. Click on phone_number field and enter 1234567
 * 9. Click on Choose a password field and enter Password123
 * 10. Click on Confirm your password field and enter Password123
 * 11. Verify that green checkmarks are displayed next to all input fields on the registration form
 * 12. Click on Submit button
 * 13. Check that the SuccessMessagePage is displayed with "/customers/register/verification-required" in URL 
 *     and the message "Account Successfully Created" is displayed
 * 14. Перейти на сторінку https://staging.nocowboys.co.nz/new/development/email-log 
 * 15. Клікнути на лінк листа імейлу, який містить у назві "validate-your-email.html" та фрагмент імейлу, який вказували на кроці 6
 * 16. Перевірити, що у новій вкладці відкрився лист верифікації імейлу
 * 17. Клікнути на лінк активації у листі
 * 18. Переконатись, що відкрилась сторінка /customers/register/verify-email/uniqueCode/
 * 19. Переконатись, що на сторінці відображається "Sign-up complete. Welcome to NoCowboys."
 */
test.describe('Customer Registration', () => {
  test('CustomerRegistrationTest - should successfully create customer account', async ({ page }) => {
    // Arrange
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const signupPage = new CustomerSignupPage(page);
    const verificationPage = new VerificationRequiredPage(page);

    // Generate unique email for each test run (email randomizer)
    const timestamp = Date.now();
    const randomNumber = Math.floor(Math.random() * 10000);
    const uniqueEmail = `serhiy.polyakov+coursor${timestamp}${randomNumber}@greenice.net`;

    const testData = {
      firstName: 'Serhiy',
      lastName: 'Coursor-Test',
      email: uniqueEmail,
      phoneCode: '123',
      phoneNumber: '1234567',
      password: 'Password123',
      confirmPassword: 'Password123',
    };

    // Act - Step 1: Open home page (base Authorization configured in playwright.config.ts)
    await homePage.goto();

    // Act - Step 2: Click Login button on Home page
    await homePage.clickLogin();

    // Act - Step 3: Click Signup link on Login page
    await loginPage.clickSignup();

    // Act - Steps 4-10: Fill registration form
    // Step 4: Click on First name field and enter Serhiy
    // Step 5: Click on Last name field and enter Coursor-Test
    // Step 6: Click on Email address field and enter email (with randomizer)
    // Step 7: Click on mainPhoneCode field and enter 123
    // Step 8: Click on phone_number field and enter 1234567
    // Step 9: Click on Choose a password field and enter Password123
    // Step 10: Click on Confirm your password field and enter Password123
    await signupPage.fillRegistrationForm(testData);

    // Act - Step 11: Verify that green checkmarks are displayed next to all input fields
    await signupPage.verifyAllValidationCheckmarks();
    const checkmarks = signupPage.getAllValidationCheckmarks();
    const checkmarkCount = await checkmarks.count();
    
    // Assert - Step 11: Verify green checkmarks are displayed (expect exactly 6 checkmarks for validated fields)
    // Checkmarks exist in DOM even if not visible, so we verify their presence
    await expect(checkmarks.first()).toBeAttached();
    expect(checkmarkCount).toBe(6);

    // Act - Step 12: Click on Submit button
    await signupPage.clickSubmit();

    // Assert - Step 13: Check that the SuccessMessagePage is displayed
    // Wait for page to load
    await verificationPage.waitForPageLoad();
    
    // Assert - Step 13: Expected Result 2: Verify "Account Successfully Created" message is displayed
    await expect(verificationPage.successMessage).toBeVisible();
    await expect(verificationPage.successMessage).toHaveText('Account Successfully Created');
    
    // Assert - Step 13: Expected Result 1: Verify page URL contains "/customers/register/verification-required"
    // URL may have ID at the end like /verification-required/108143
    await expect(page).toHaveURL(/.*\/customers\/register\/verification-required/);

    // Act - Step 14: Navigate to email logs page
    const emailLogsPage = new EmailLogsPage(page);
    await emailLogsPage.goto();
    await emailLogsPage.waitForPageLoad();

    // Extract email fragment (part before @) for searching email in logs
    // Email format: serhiy.polyakov+coursor123456789012345@greenice.net
    // Fragment: serhiy.polyakov+coursor123456789012345
    const emailFragment = testData.email.split('@')[0];

    // Act - Step 15: Click on email link that contains "validate-your-email.html" and email fragment
    // This opens email in a new tab
    const emailPage = await emailLogsPage.clickEmailWithSubjectAndFragment('validate-your-email', emailFragment);

    // Assert - Step 16: Verify that email verification page is opened in new tab
    await emailPage.waitForLoadState('domcontentloaded');
    // Verify that email content is loaded (check for email body structure)
    const emailBody = emailPage.locator('table#bodyTable');
    await expect(emailBody).toBeVisible({ timeout: 10000 });

    // Act - Step 17: Click on verification link in the email content
    // Create EmailVerificationPage for the email page to find and click verification link
    const emailVerificationPage = new EmailVerificationPage(emailPage);
    await emailVerificationPage.clickVerificationLink();

    // Wait for navigation to verification page (might navigate in same tab or open new tab)
    // Set up listeners for both scenarios
    const newPagePromise = page.context().waitForEvent('page', { timeout: 5000 }).catch(() => null);
    const emailPageNavigationPromise = emailPage.waitForURL(/.*\/customers\/register\/verify-email\/uniqueCode\//, { timeout: 10000 }).catch(() => null);

    // Wait for either a new page to open or navigation in the email page
    const [newPage, emailNavigated] = await Promise.all([
      newPagePromise,
      emailPageNavigationPromise
    ]);

    // Determine which page has the verification result
    let verificationResultPage: Page;
    if (newPage) {
      // New page was opened
      verificationResultPage = newPage;
      await newPage.waitForLoadState('domcontentloaded');
      // Close the email page
      await emailPage.close();
    } else if (emailNavigated !== null) {
      // Navigation happened in email page
      verificationResultPage = emailPage;
    } else {
      // Fallback: check if original page navigated (unlikely but possible)
      try {
        await page.waitForURL(/.*\/customers\/register\/verify-email\/uniqueCode\//, { timeout: 5000 });
        verificationResultPage = page;
        await emailPage.close();
      } catch {
        // If nothing happened, assume navigation is in email page
        verificationResultPage = emailPage;
      }
    }

    // Create EmailVerificationPage for the target page to verify success message
    const verificationResultPageObj = new EmailVerificationPage(verificationResultPage);

    // Assert - Step 18: Verify that verification page is displayed with URL containing "/customers/register/verify-email/uniqueCode/"
    await expect(verificationResultPage).toHaveURL(/.*\/customers\/register\/verify-email\/uniqueCode\//);

    // Assert - Step 19: Verify that "Sign-up complete. Welcome to NoCowboys." message is displayed
    await verificationResultPageObj.waitForPageLoad();
    await expect(verificationResultPageObj.successMessage).toBeVisible();
    await expect(verificationResultPageObj.successMessage).toHaveText('Sign-up complete. Welcome to NoCowboys.');
  });
});
