import { expect } from '@playwright/test';
import { generateRandomPatient, deletePatient, type Patient } from '../commands';
import { test } from '../core';
import { MentalHealthPage } from '../pages';

let patient: Patient;

test.beforeEach(async ({ api }) => {
  patient = await generateRandomPatient(api);
});

test.afterEach(async ({ api }) => {
  await deletePatient(api, patient.uuid);
});

test('View, Add and Edit Patient Mental Health', async ({ page }) => {
  const mentalHealthPage = new MentalHealthPage(page);

  await test.step('When I visit the Mental Health page', async () => {
    await mentalHealthPage.goTo(patient.uuid);
  });

  await test.step('Then I should see the Mental Health widget', async () => {
    await expect(mentalHealthPage.emptyStateHeading()).toBeVisible();
  });
});
