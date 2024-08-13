import { type PatientIdentifier, type Person, type OpenmrsResource } from '@openmrs/esm-framework';

export interface NutritionFetchResponse {
  results: Array<Encounter>;
}

export interface Encounter {
  uuid: string;
  encounterDatetime: string;
  encounterType: {
    uuid: string;
    display: string;
    name: string;
    description: string;
    retired: boolean;
  };
  location: {
    uuid: string;
    name: string;
  };
  patient: Patient;
  encounterProviders: Array<EncounterProvider>;
  obs: Array<Observation>;
  form: any;
}

export interface Patient {
  uuid: string;
  display: string;
  age: number;
  identifiers: Array<PatientIdentifier>;
  person: Person;
}

export interface EncounterProvider {
  uuid: string;
  provider: {
    uuid: string;
    name: string;
  };
}

export interface Observation {
  uuid: string;
  display: string;
  concept: {
    uuid: string;
    display: string;
  };
  obsGroup: any;
  obsDatetime: string;
  groupMembers?: Array<Observation>;
  value: {
    uuid: string;
    display: string;
  };
  location: OpenmrsResource;
  status: string;
}
