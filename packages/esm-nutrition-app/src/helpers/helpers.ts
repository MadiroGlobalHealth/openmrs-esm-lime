import { launchPatientWorkspace } from '@openmrs/esm-patient-common-lib';

const nutritionFormName = 'Nutrition - Feeding Form';

export function launchNutritionFeedingForm(
  patientUuid: string,
  action: 'enter' | 'edit',
  intent?: 'enter' | 'view',
  onFormSave?: () => void,
) {
  launchPatientWorkspace('patient-form-entry-workspace', {
    workspaceTitle: nutritionFormName,
    mutateForm: onFormSave,
    formInfo: {
      encounterUuid: '',
      formUuid: nutritionFormName,
      patientUuid: patientUuid,
      visitTypeUuid: '',
      visitUuid: '',
      visitStartDatetime: '',
      visitStopDatetime: '',
      additionalProps: {
        mode: action,
      },
    },
  });
}
