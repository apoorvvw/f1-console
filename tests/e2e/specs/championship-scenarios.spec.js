// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Championship Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/championship');
  });

  test('shows championship page heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Championship Standings/i })).toBeVisible();
  });

  test('round slider is visible', async ({ page }) => {
    await expect(page.getByRole('slider', { name: /championship round/i })).toBeVisible();
  });

  test('DataGrid renders when data loads', async ({ page }) => {
    const grid = page.locator('.MuiDataGrid-root');
    await expect(grid).toBeVisible({ timeout: 10000 });
  });

  test('clicking a driver row opens scenario panel', async ({ page }) => {
    const grid = page.locator('.MuiDataGrid-root');
    await expect(grid).toBeVisible({ timeout: 10000 });

    const firstRow = page.locator('.MuiDataGrid-row').first();
    await firstRow.click();

    // Scenario panel (Drawer) should open
    await expect(page.locator('.MuiDrawer-paper')).toBeVisible({ timeout: 5000 });
  });
});
