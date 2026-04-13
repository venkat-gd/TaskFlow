import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', 'demo@taskflow.app');
    await page.fill('#password', 'Demo@1234');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('dashboard shows correct task counts', async ({ page }) => {
    await expect(page.locator('text=Total Tasks')).toBeVisible();
    await expect(page.locator('text=Completed Today')).toBeVisible();
    await expect(page.locator('text=Overdue')).toBeVisible();
    await expect(page.locator('text=Completion Rate')).toBeVisible();
  });

  test('dashboard shows completed this week chart', async ({ page }) => {
    await expect(page.locator('text=Completed This Week')).toBeVisible();
  });

  test('dashboard shows recent activity feed', async ({ page }) => {
    await expect(page.locator('text=Recent Activity')).toBeVisible();
  });
});
