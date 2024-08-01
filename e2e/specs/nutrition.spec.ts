import { expect } from '@playwright/test';
import { generateRandomPatient, deletePatient, type Patient } from '../commands';
import { test } from '../core';
import { NutritionPage } from '../pages';

let patient: Patient;

test.beforeEach(async ({ api }) => {
  patient = await generateRandomPatient(api);
});

test('View, Add and Edit Patient Nutrition', async ({ page }) => {
  const nutritionPage = new NutritionPage(page);
  const headerRow = nutritionPage.nutritionTable().locator('thead > tr');
  const dataRow = nutritionPage.nutritionTable().locator('tbody > tr');

  await test.step('When I visit the Allergies page', async () => {
    await nutritionPage.goTo(patient.uuid);
  });
});
