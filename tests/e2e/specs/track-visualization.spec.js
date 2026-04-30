// @ts-check
const { test, expect } = require('@playwright/test');
const { SessionSelectorPage } = require('../pages/SessionSelectorPage');

test.describe('Track Visualization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/track');
    const selectorPage = new SessionSelectorPage(page);
    await selectorPage.openDialog();
    await selectorPage.selectYear(2024);
    await selectorPage.selectEvent('Bahrain Grand Prix');
    await selectorPage.selectSessionType('Q');
    await selectorPage.confirm();
  });

  test('shows track page heading with session info', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Track Visualization/i })).toBeVisible();
    await expect(page.getByText(/2024.*Bahrain/i)).toBeVisible();
  });

  test('driver select dropdown is visible', async ({ page }) => {
    await expect(page.getByLabel('Driver')).toBeVisible();
  });

  test('telemetry metric toggle buttons are visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Speed' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Throttle' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Brake' })).toBeVisible();
  });

  test('corner annotations switch is visible', async ({ page }) => {
    await expect(page.getByText(/corner annotations/i)).toBeVisible();
  });
});
