// @ts-check
const { test, expect } = require('@playwright/test');
const { SessionSelectorPage } = require('../pages/SessionSelectorPage');

test.describe('Qualifying Results', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/qualifying');
    const selectorPage = new SessionSelectorPage(page);
    await selectorPage.openDialog();
    await selectorPage.selectYear(2024);
    await selectorPage.selectEvent('Monaco Grand Prix');
    await selectorPage.selectSessionType('Q');
    await selectorPage.confirm();
  });

  test('shows qualifying heading with session info', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Qualifying/i })).toBeVisible();
    await expect(page.getByText(/Monaco/i)).toBeVisible();
  });

  test('round filter toggle buttons visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Q1' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Q2' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Q3' })).toBeVisible();
  });

  test('DataGrid renders when data loads', async ({ page }) => {
    // Wait for grid to appear (depends on backend availability)
    const grid = page.locator('.MuiDataGrid-root');
    await expect(grid).toBeVisible({ timeout: 10000 });
  });
});
