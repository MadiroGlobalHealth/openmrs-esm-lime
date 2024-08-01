import {
  defineConfigSchema,
  getSyncLifecycle,
} from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import { createDashboardLink as createPatientChartDashboardLink } from '@openmrs/esm-patient-common-lib';
import { patientChartDashboardMeta } from './dashboard.meta';
import NutritionSummary from './nutrition-summary/nutrition-summary.component';
export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

const moduleName = '@madiro/esm-nutrition-app';

const options = {
  featureName: 'nutrition',
  moduleName,
};

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

// t('Nutrition', 'Nutrition')
export const patientNutritionSummaryDashboardLink = getSyncLifecycle(
  createPatientChartDashboardLink({ ...patientChartDashboardMeta, moduleName }),
  options,
);

export const patientNutritionSummary = getSyncLifecycle(NutritionSummary, options);