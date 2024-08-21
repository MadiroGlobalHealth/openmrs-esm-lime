import { launchPatientWorkspace } from '@openmrs/esm-patient-common-lib';
import { nutritionEncounterUuid } from '../constants';

type FormAction = 'add' | 'view' | 'edit';

export function launchClinicalViewForm(
  form: any,
  patientUuid: string,
  onFormSave: () => void,
  action: FormAction = 'add',
  title?: string,
  workspaceWindowSize?: 'minimized' | 'maximized',
) {
  launchPatientWorkspace('patient-form-entry-workspace', {
    workspaceTitle: form.name,
    mutateForm: onFormSave,
    formInfo: {
      nutritionEncounterUuid,
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
