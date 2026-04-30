// @ts-check
const { expect } = require('@playwright/test');

class DashboardPage {
  constructor(page) {
    this.page = page;

    /** The main "Select Session" button on the hero card */
    this.selectSessionButton = page.getByRole('button', { name: /select session/i });

    /** The Tracks navigation card link */
    this.tracksCardLink = page.getByRole('link', { name: /explore circuits/i });

    /** Recent session chip buttons */
    this.recentSessionChips = page.locator('button').filter({ hasText: /–/ });
  }

  async goto() {
    await this.page.goto('/');
  }

  async openSessionSelector() {
    await this.selectSessionButton.click();
    await expect(this.page.getByRole('dialog', { name: /select session/i })).toBeVisible();
  }

  async navigateToTracks() {
    await this.tracksCardLink.click();
  }
}

module.exports = { DashboardPage };
