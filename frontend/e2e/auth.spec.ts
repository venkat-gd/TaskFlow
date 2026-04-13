import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('user can register with valid credentials', async ({ page }) => {
    await page.goto('/register');
    await page.fill('#email', `test${Date.now()}@example.com`);
    await page.fill('#username', 'testuser');
    await page.fill('#password', 'Strong@123');
    await page.fill('#confirmPassword', 'Strong@123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('registration shows validation errors for weak password', async ({ page }) => {
    await page.goto('/register');
    await page.fill('#email', 'test@example.com');
    await page.fill('#username', 'user');
    await page.fill('#password', 'weak');
    await page.fill('#confirmPassword', 'weak');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=at least 8 characters')).toBeVisible();
  });

  test('user can login and sees dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', 'demo@taskflow.app');
    await page.fill('#password', 'Demo@1234');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('invalid login shows error message', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', 'wrong@example.com');
    await page.fill('#password', 'Wrong@1234');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Invalid')).toBeVisible();
  });

  test('logout clears session and redirects to landing', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', 'demo@taskflow.app');
    await page.fill('#password', 'Demo@1234');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);
    await page.click('text=Logout');
    await expect(page.locator('text=Sign In')).toBeVisible();
  });
});
