import { launchPatientWorkspace } from '@openmrs/esm-patient-common-lib';
import { type FormSchema } from '@openmrs/esm-form-engine-lib';

type FormAction = 'add' | 'view' | 'edit';

export function launchClinicalViewForm(
  form: FormSchema,
  patientUuid: string,
  onFormSave: () => void,
  action: FormAction = 'add',
  encounterUuid?: string,
  workspaceWindowSize?: 'minimized' | 'maximized',
) {
  launchPatientWorkspace('patient-form-entry-workspace', {
    workspaceTitle: form.name,
    mutateForm: onFormSave,
    formInfo: {
      encounterUuid,
      formUuid: form.name,
      patientUuid: patientUuid,
      visitTypeUuid: '',
      visitUuid: '',
      visitStartDatetime: '',
      visitStopDatetime: '',
      additionalProps: {
        mode: action === 'add' ? 'enter' : action,
      },
    },
  });
}

export function mealSymbol(value: string): string {
  switch (value) {
    case '0%':
      return '-';
    case '25%':
      return '+';
    case '50%':
      return '++';
    case '75%':
      return '+++';
    case '100%':
      return '++++';
    default:
      return '';
  }
}
