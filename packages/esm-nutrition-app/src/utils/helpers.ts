import { launchWorkspace2, openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import { type Form } from '@openmrs/esm-patient-common-lib';
import dayjs from 'dayjs';
import { dateFormat } from '../constants';

type FormAction = 'add' | 'view' | 'edit';

export function launchClinicalViewForm(
  form: Form,
  patientUuid: string,
  action: FormAction = 'add',
  encounterUuid?: string,
) {
  launchWorkspace2(
    'patient-form-entry-workspace',
    {
      form,
      encounterUuid,
      additionalProps: {
        mode: action === 'add' ? 'enter' : action,
      },
    },
    { patientUuid },
  );
}

export function mealSymbol(value: string): string {
  switch (value) {
    case '0%':
      return '-';
    case '25%':
      return 'X';
    case '50%':
      return 'XX';
    case '75%':
      return 'XXX';
    case '100%':
      return 'XXXX';
    default:
      return '';
  }
}

export function getPatientEncounterDates(patientUuid: string, encounterTypeUuid: string) {
  let params = `encounterType=${encounterTypeUuid}&patient=${patientUuid}&v=custom:(uuid,encounterDatetime)`;
  return openmrsFetch(`${restBaseUrl}/encounter?${params}`).then(({ data }) => {
    if (data.results.length === 0) {
      return [];
    }
    return data.results.map((encounter: any) => dayjs(encounter.encounterDatetime).format(dateFormat));
  });
}
