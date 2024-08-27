import { launchPatientWorkspace } from '@openmrs/esm-patient-common-lib';
import { type FormSchema } from '@openmrs/esm-form-engine-lib';
import { type Observation, type Encounter } from '../types';

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

export function amountTakenValue(encounter: Encounter, amountTakenConcept: string) {
  const obsConcept = encounter.obs.find((obs) => obs.concept.uuid === amountTakenConcept);

  if (obsConcept) {
    return amountTakenNames(obsConcept);
  } else {
    return {
      name: '--',
      shortName: '--',
      color: 'Grey',
    };
  }
}

export type ConceptNamesType = {
  name: string;
  shortName: string;
  color: string;
};

export function amountTakenNames(obs: Observation): ConceptNamesType {
  const value = obs.value?.name?.name;
  switch (value) {
    case '0%':
      return {
        name: '0%',
        shortName: '-',
        color: 'Red',
      };
    case '25%':
      return {
        name: '25%',
        shortName: '+',
        color: 'Orange',
      };
    case '50%':
      return {
        name: '50%',
        shortName: '++',
        color: 'Yellow',
      };
    case '75%':
      return {
        name: '75%',
        shortName: '+++',
        color: 'Blue',
      };
    case '100%':
      return {
        name: '100%',
        shortName: '++++',
        color: 'Green',
      };
    default:
      return {
        name: '--',
        shortName: '--',
        color: 'Grey',
      };
  }
}
