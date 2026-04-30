// @ts-check
const { expect } = require('@playwright/test');

class SessionSelectorPage {
  constructor(page) {
    this.page = page;
    this.dialog = page.getByRole('dialog', { name: 'Select Session' });
    this.yearSelect = page.getByLabel('Year');
    this.gpSelect = page.getByLabel('Grand Prix');
    this.sessionTypeSelect = page.getByLabel('Session Type');
    this.confirmButton = page.getByRole('button', { name: 'Confirm' });
    this.sessionButton = page.getByRole('button', { name: /select session|–/i });
  }

  async openDialog() {
    await this.sessionButton.click();
    await expect(this.dialog).toBeVisible();
  }

  async selectYear(year) {
    await this.yearSelect.click();
    await this.page.getByRole('option', { name: String(year), exact: true }).click();
  }

  async selectEvent(event) {
    await this.gpSelect.click();
    await this.page.getByRole('option', { name: event }).click();
  }

  async selectSessionType(type) {
    await this.sessionTypeSelect.click();
    await this.page.getByRole('option', { name: type, exact: true }).click();
  }

  async confirm() {
    await this.confirmButton.click();
    await expect(this.dialog).not.toBeVisible();
  }

  async getRecentSessionChips() {
    return this.page.locator('[data-testid="recent-session-chip"], .MuiChip-root').all();
  }
}

module.exports = { SessionSelectorPage };
