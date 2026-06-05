import { type Page } from '@playwright/test';

export class NutritionPage {
  constructor(readonly page: Page) {}

  readonly nutritionTable = () => this.page.getByRole('table', { name: 'nutrition summary' });
  readonly emptyStateHeading = () => this.page.getByRole('heading', { name: 'Nutrition Summary' });

  async goTo(patientUuid: string) {
    await this.page.goto('/openmrs/spa/patient/' + patientUuid + '/chart/Nutrition');
  }
}
