import { type Page } from '@playwright/test';

export class MentalHealthPage {
  constructor(private readonly page: Page) {}

  readonly mentalHealthTable = () => this.page.getByRole('table', { name: 'Mental Health' });
  readonly emptyStateHeading = () => this.page.getByRole('heading', { name: 'Mental Health' });

  async goTo(patientUuid: string) {
    await this.page.goto('/openmrs/spa/patient/' + patientUuid + '/chart/Mental Health');
  }
}
