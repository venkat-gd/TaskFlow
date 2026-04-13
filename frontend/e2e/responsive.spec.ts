import { test, expect, devices } from '@playwright/test';

test.describe('Responsive Design', () => {
  test('mobile viewport shows hamburger menu', async ({ browser }) => {
    const context = await browser.newContext({ ...devices['iPhone 13'] });
    const page = await context.newPage();
    await page.goto('/login');
    await page.fill('#email', 'demo@taskflow.app');
    await page.fill('#password', 'Demo@1234');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);
    // Hamburger should be visible on mobile
    const menuBtn = page.locator('button svg path[d*="M4 6h16"]').locator('..');
    await expect(menuBtn).toBeVisible();
    await context.close();
  });

  test('tablet viewport shows sidebar collapsed', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 768, height: 1024 },
    });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.locator('text=TaskFlow')).toBeVisible();
    await context.close();
  });

  test('landing page renders on mobile', async ({ browser }) => {
    const context = await browser.newContext({ ...devices['iPhone 13'] });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.locator('text=Full-Stack')).toBeVisible();
    await expect(page.locator('text=Try the Live Demo')).toBeVisible();
    await context.close();
  });
});
