import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';

/**
 * Search Business by Name Test
 * 
 * Manual Test Case: SearchBusinessByNameTest
 * 
 * Test Steps:
 * 1. Перейди на https://staging.nocowboys.co.nz (for base Authorization use HTTP_AUTH_USERNAME and HTTP_AUTH_PASSWORD from .env)
 * 2. Click on 'Search Business by name' button
 * 3. On search field enter 'Greenice'
 * 4. After a short pause, verify that all results in dropdown contain the search query "Greenice"
 * 5. Click Enter button
 * 6. Verify that SearchBusinessByName page loaded
 * 7. Verify that on the loaded SearchBusinessByName page, all businesses in search results contain the search query "Greenice" in their name
 */
test.describe('Search Business by Name', () => {
  test('SearchBusinessByNameTest - should search for business and verify results contain search query', async ({ page }) => {
    // Arrange
    const homePage = new HomePage(page);
    const searchResultsPage = new SearchResultsPage(page);
    const searchQuery = 'Greenice';

    // Act - Step 1: Open home page (base Authorization configured in playwright.config.ts)
    await homePage.goto();

    // Act - Step 2: Click on 'Search Business by name' button
    await homePage.clickSearchButton();

    // Wait for search input to appear
    await homePage.searchInput.waitFor({ state: 'visible', timeout: 5000 });

    // Act - Step 3: On search field enter 'Greenice'
    await homePage.enterSearchQuery(searchQuery);

    // Wait a short pause for dropdown results to appear (as per step 4 requirement)
    await page.waitForTimeout(1000);

    // Act - Step 4: Wait for dropdown results to appear
    await homePage.waitForDropdownResults();

    // Assert - Step 4: Verify that all results in dropdown contain the search query "Greenice"
    const dropdownResults = homePage.getDropdownResults();
    const dropdownResultsCount = await dropdownResults.count();
    
    if (dropdownResultsCount > 0) {
      for (let i = 0; i < dropdownResultsCount; i++) {
        const resultText = await dropdownResults.nth(i).textContent();
        expect(resultText?.toLowerCase()).toContain(searchQuery.toLowerCase());
      }
    }

    // Act - Step 5: Click Enter button
    await homePage.pressEnterInSearch();

    // Act - Step 6: Wait for SearchBusinessByName page to load
    await searchResultsPage.waitForPageLoad();

    // Assert - Step 6: Verify that SearchBusinessByName page loaded
    // Check URL contains search-related path (common patterns: /search, /businesses/search, etc.)
    const currentUrl = page.url().toLowerCase();
    expect(currentUrl).toMatch(/search|business/i);

    // Assert - Step 7: Verify that all businesses in search results contain the search query "Greenice" in their name
    const businessResults = searchResultsPage.getAllBusinessResults();
    const businessResultsCount = await businessResults.count();
    
    expect(businessResultsCount).toBeGreaterThan(0);
    
    for (let i = 0; i < businessResultsCount; i++) {
      const businessItem = businessResults.nth(i);
      const businessName = searchResultsPage.getBusinessName(businessItem);
      const businessNameText = await businessName.textContent();
      expect(businessNameText?.toLowerCase()).toContain(searchQuery.toLowerCase());
    }
  });
});
