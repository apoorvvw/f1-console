// @ts-check
const { expect } = require('@playwright/test');

class QualifyingResultsPage {
  constructor(page) {
    this.page = page;
  }

  deltaChart() {
    return this.page.locator('[aria-label="Qualifying delta chart"]');
  }

  chartBar(driverAbbr) {
    return this.page.locator(`[role="button"][aria-label*="${driverAbbr} gap"]`);
  }

  tableRow(driverAbbr) {
    return this.page.locator(`.MuiDataGrid-row:has-text("${driverAbbr}")`);
  }

  selectedTableRow() {
    return this.page.locator('.MuiDataGrid-row.q-selected-row');
  }

  trackMapRegion() {
    return this.page.locator('canvas').first();
  }

  metricToggleButtons() {
    return this.page.getByRole('group', { name: 'telemetry metric' });
  }

  cornerAnnotationsToggle() {
    return this.page.getByRole('button', { name: /toggle corner annotations/i });
  }

  roundFilterGroup() {
    return this.page.getByRole('group', { name: 'qualifying round filter' });
  }

  async clickBar(driverAbbr) {
    await this.chartBar(driverAbbr).click();
  }

  async clickRow(driverAbbr) {
    await this.tableRow(driverAbbr).click();
  }

  async waitForChart() {
    await expect(this.deltaChart()).toBeVisible({ timeout: 15000 });
  }

  async waitForTrackMap() {
    await expect(this.trackMapRegion()).toBeVisible({ timeout: 15000 });
  }
}

module.exports = { QualifyingResultsPage };
