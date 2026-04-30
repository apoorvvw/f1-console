// @ts-check
const { test, expect } = require('@playwright/test');
const { SessionSelectorPage } = require('../pages/SessionSelectorPage');

test.describe('Lap Times', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/lap-times');
    const selectorPage = new SessionSelectorPage(page);
    await selectorPage.openDialog();
    await selectorPage.selectYear(2024);
    await selectorPage.selectEvent('Bahrain Grand Prix');
    await selectorPage.selectSessionType('R');
    await selectorPage.confirm();
  });

  test('renders lap times page with session info', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Lap Times/i })).toBeVisible();
    await expect(page.getByText(/2024.*Bahrain/i)).toBeVisible();
  });

  test('driver filter Autocomplete is visible', async ({ page }) => {
    await expect(page.getByLabel('Drivers')).toBeVisible();
  });

  test('compound filter Select is visible', async ({ page }) => {
    await expect(page.getByLabel('Compound')).toBeVisible();
  });
});
