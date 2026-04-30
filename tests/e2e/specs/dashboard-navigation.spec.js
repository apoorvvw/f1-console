// @ts-check
const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('../pages/DashboardPage');
const { SessionSelectorPage } = require('../pages/SessionSelectorPage');

test.describe('Dashboard Navigation', () => {
  test('loads the Dashboard at root URL', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await expect(dashboard.selectSessionButton).toBeVisible();
    await expect(dashboard.tracksCardLink).toBeVisible();
  });

  test('selecting a Race session navigates to /race', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await dashboard.openSessionSelector();

    const selector = new SessionSelectorPage(page);
    await selector.selectYear(2024);
    await selector.selectEvent('Monaco Grand Prix');
    await selector.selectSessionType('R');
    await selector.confirm();

    await expect(page).toHaveURL(/\/race/);
  });

  test('selecting a Qualifying session navigates to /qualifying', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await dashboard.openSessionSelector();

    const selector = new SessionSelectorPage(page);
    await selector.selectYear(2024);
    await selector.selectEvent('Monaco Grand Prix');
    await selector.selectSessionType('Q');
    await selector.confirm();

    await expect(page).toHaveURL(/\/qualifying/);
  });

  test('clicking the Tracks card navigates to /track', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await dashboard.navigateToTracks();
    await expect(page).toHaveURL(/\/track/);
  });
});
