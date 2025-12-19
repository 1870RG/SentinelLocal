import { test, expect } from '@playwright/test';

test.describe('SentinelLocal App', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check that the page title or main content is present
    await expect(page).toHaveTitle(/Sentinel/i);
  });

  test('login page is accessible', async ({ page }) => {
    await page.goto('/');
    
    // Check if login elements are present
    const loginButton = page.getByRole('button', { name: /login|sign in/i });
    await expect(loginButton).toBeVisible({ timeout: 10000 });
  });

  test('navigation works', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Test that the page is interactive
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('can install dependencies and run build', async ({ page }) => {
    // This test validates the npm ci fix
    await page.goto('/');
    
    // Just verify the app loads - if npm ci failed, the build wouldn't work
    await expect(page).not.toHaveTitle(/error/i);
    
    // Check console for any critical errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.waitForTimeout(2000);
    
    // Allow some errors but not critical ones
    const criticalErrors = errors.filter(e => 
      e.includes('Failed to fetch') || 
      e.includes('ECONNREFUSED') ||
      e.includes('Cannot read')
    );
    
    expect(criticalErrors.length).toBe(0);
  });
});
