import { generateRandomPatient, type Patient } from '../commands';
import { test } from '../core';
import { MentalHealthPage } from '../pages';

let patient: Patient;

test.beforeEach(async ({ api }) => {
  patient = await generateRandomPatient(api);
});

test('View, Add and Edit Patient Mental Health', async ({ page }) => {
  const mentalHealthPage = new MentalHealthPage(page);
  const headerRow = mentalHealthPage.mentalHealthTable().locator('thead > tr');
  const dataRow = mentalHealthPage.mentalHealthTable().locator('tbody > tr');

  await test.step('When I visit the Mental Health page', async () => {
    await mentalHealthPage.goTo(patient.uuid);
  });
});
