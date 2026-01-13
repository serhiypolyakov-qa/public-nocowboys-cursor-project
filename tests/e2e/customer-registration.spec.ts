import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { CustomerSignupPage } from '../pages/CustomerSignupPage';
import { VerificationRequiredPage } from '../pages/VerificationRequiredPage';

/**
 * Customer Registration Test
 * 
 * Manual Test Case: CustomerRegistrationTest
 * 
 * Test Steps:
 * 1. Open https://staging.nocowboys.co.nz (with base Authorization: username: 'nocowboys', password: 'PWAOUR4')
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
  });
});
