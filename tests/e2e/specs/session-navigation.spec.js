// @ts-check
const { test, expect } = require('@playwright/test');
const { SessionSelectorPage } = require('../pages/SessionSelectorPage');

test.describe('Session Navigation', () => {
  test('select session and verify NavBar updates', async ({ page }) => {
    await page.goto('/');
    const selectorPage = new SessionSelectorPage(page);

    await selectorPage.openDialog();
    await selectorPage.selectYear(2024);
    await selectorPage.selectEvent('Bahrain Grand Prix');
    await selectorPage.selectSessionType('R');
    await selectorPage.confirm();

    await expect(page.getByRole('button', { name: /2024.*Bahrain/i })).toBeVisible();
  });

  test('recent sessions chip appears after second selection', async ({ page }) => {
    await page.goto('/');
    const selectorPage = new SessionSelectorPage(page);

    // Select first session
    await selectorPage.openDialog();
    await selectorPage.selectYear(2024);
    await selectorPage.selectEvent('Bahrain Grand Prix');
    await selectorPage.selectSessionType('R');
    await selectorPage.confirm();

    // Select second session
    await selectorPage.openDialog();
    await selectorPage.selectYear(2023);
    await selectorPage.selectEvent('British Grand Prix');
    await selectorPage.selectSessionType('R');
    await selectorPage.confirm();

    // Bahrain chip should appear in recent sessions strip
    await expect(page.getByText(/Bahrain/i).first()).toBeVisible();
  });
});
