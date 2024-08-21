import { launchPatientWorkspace } from '@openmrs/esm-patient-common-lib';
import { nutritionEncounterUuid } from '../constants';
import { type Observation, type Encounter } from '../types';

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

export function feedingRemark(encounter: Encounter, remarkConept: string) {
  const obsConcept = encounter.obs.find((obs) => obs.concept.uuid === remarkConept);

  if (obsConcept) {
    let value = obsConcept.value?.name?.name;
    return value ? value.charAt(0) : 'Missing';
  } else {
    return 'Missing';
  }
}

type ConceptNamesType = {
  name: string;
  shortName: string;
  color: string;
}

export function amountTakenNames(obs: Observation) {
  let conceptName: ConceptNamesType;
  const value = obs.value?.name?.name;
  switch(value) {
    case '0%':
      conceptName = {
        name: '0%',
        shortName: '-',
        color: 'Red',
      };
      break;
    case '25%':
      conceptName = {
        name: '25%',
        shortName: '+',
        color: 'Orange',
      };
      break;
    case '50%':
      conceptName = {
        name: '50%',
        shortName: '++',
        color: 'Yellow',
      };
      break;
    case '75%':
      conceptName = {
        name: '75%',
        shortName: '+++',
        color: 'Blue',
      };
      break;
    case '100%':
      conceptName = {
        name: '100%',
        shortName: '++++',
        color: 'Green',
      };
      break;
    default:
      conceptName = {
        name: '--',
        shortName: '--',
        color: 'Grey',
      };
  }
}
