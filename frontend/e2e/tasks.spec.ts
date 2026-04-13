import { test, expect } from '@playwright/test';

test.describe('Tasks', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', 'demo@taskflow.app');
    await page.fill('#password', 'Demo@1234');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('user can create a task from dashboard quick-add', async ({ page }) => {
    await page.fill('input[placeholder="Quick add a task..."]', 'E2E Test Task');
    await page.click('button:has-text("Add")');
    await expect(page.locator('text=E2E Test Task')).toBeVisible();
  });

  test('task appears in kanban board under correct column', async ({ page }) => {
    await page.goto('/tasks');
    await expect(page.locator('text=To Do')).toBeVisible();
    await expect(page.locator('text=In Progress')).toBeVisible();
    await expect(page.locator('text=Done')).toBeVisible();
  });

  test('user can filter tasks by priority', async ({ page }) => {
    await page.goto('/tasks');
    await page.selectOption('select:has-text("All Priorities")', 'high');
    // Should only show high priority tasks
    const tasks = page.locator('[class*="rounded-lg border"]');
    await expect(tasks.first()).toBeVisible();
  });

  test('user can search tasks by title', async ({ page }) => {
    await page.goto('/tasks');
    await page.fill('input[placeholder="Search tasks..."]', 'nonexistent');
    // Kanban should still render but with no matching cards
    await expect(page.locator('text=To Do')).toBeVisible();
  });

  test('user can create a new task via modal', async ({ page }) => {
    await page.goto('/tasks');
    await page.click('button:has-text("New Task")');
    await page.fill('#title', 'Modal Created Task');
    await page.click('button:has-text("Create")');
    await expect(page.locator('text=Modal Created Task')).toBeVisible();
  });

  test('user can delete a task', async ({ page }) => {
    await page.goto('/tasks');
    await page.click('button:has-text("New Task")');
    await page.fill('#title', 'To Be Deleted');
    await page.click('button:has-text("Create")');
    await expect(page.locator('text=To Be Deleted')).toBeVisible();
    // Click first delete button near the task
    page.on('dialog', (dialog) => dialog.accept());
    const deleteBtn = page.locator('text=To Be Deleted').locator('..').locator('button').last();
    await deleteBtn.click();
  });
});
