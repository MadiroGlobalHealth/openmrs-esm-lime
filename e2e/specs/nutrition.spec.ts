import { expect } from '@playwright/test';
import { generateRandomPatient, deletePatient, type Patient } from '../commands';
import { test } from '../core';
import { NutritionPage } from '../pages';

let patient: Patient;

test.beforeEach(async ({ api }) => {
  patient = await generateRandomPatient(api);
});

test.afterEach(async ({ api }) => {
  await deletePatient(api, patient.uuid);
});

test('View, Add and Edit Patient Nutrition', async ({ page }) => {
  const nutritionPage = new NutritionPage(page);

  await test.step('When I visit the Nutrition page', async () => {
    await nutritionPage.goTo(patient.uuid);
  });

  await test.step('Then I should see the Nutrition widget', async () => {
    await expect(nutritionPage.emptyStateHeading()).toBeVisible();
  });
});
