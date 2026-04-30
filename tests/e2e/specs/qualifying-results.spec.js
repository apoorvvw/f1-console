// @ts-check
const { test, expect } = require('@playwright/test');
const { SessionSelectorPage } = require('../pages/SessionSelectorPage');
const { QualifyingResultsPage } = require('../pages/QualifyingResultsPage');

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
    const grid = page.locator('.MuiDataGrid-root');
    await expect(grid).toBeVisible({ timeout: 10000 });
  });

  test('delta chart is visible after data loads', async ({ page }) => {
    const qPage = new QualifyingResultsPage(page);
    await qPage.waitForChart();
  });

  test('clicking a chart bar highlights corresponding table row', async ({ page }) => {
    const qPage = new QualifyingResultsPage(page);
    await qPage.waitForChart();

    // Click the first visible bar
    const firstBar = qPage.deltaChart().locator('[role="button"]').first();
    await firstBar.click();

    // Expect a highlighted row to appear in the grid
    await expect(qPage.selectedTableRow()).toBeVisible({ timeout: 5000 });
  });

  test('right column track map is visible after bar click', async ({ page }) => {
    const qPage = new QualifyingResultsPage(page);
    await qPage.waitForChart();

    const firstBar = qPage.deltaChart().locator('[role="button"]').first();
    await firstBar.click();

    await qPage.waitForTrackMap();
  });

  test('metric toggle buttons are visible after driver selection', async ({ page }) => {
    const qPage = new QualifyingResultsPage(page);
    await qPage.waitForChart();

    const firstBar = qPage.deltaChart().locator('[role="button"]').first();
    await firstBar.click();

    await expect(qPage.metricToggleButtons()).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole('button', { name: 'Speed' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Throttle' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Brake' })).toBeVisible();
  });

  test('corner annotations toggle is visible after driver selection', async ({ page }) => {
    const qPage = new QualifyingResultsPage(page);
    await qPage.waitForChart();

    const firstBar = qPage.deltaChart().locator('[role="button"]').first();
    await firstBar.click();

    await expect(qPage.cornerAnnotationsToggle()).toBeVisible({ timeout: 5000 });
  });

  test('clicking same bar deselects driver and hides track map', async ({ page }) => {
    const qPage = new QualifyingResultsPage(page);
    await qPage.waitForChart();

    const firstBar = qPage.deltaChart().locator('[role="button"]').first();
    await firstBar.click();
    await expect(qPage.selectedTableRow()).toBeVisible({ timeout: 5000 });

    // Click same bar again to deselect
    await firstBar.click();
    await expect(qPage.selectedTableRow()).not.toBeVisible({ timeout: 3000 });
  });
});
