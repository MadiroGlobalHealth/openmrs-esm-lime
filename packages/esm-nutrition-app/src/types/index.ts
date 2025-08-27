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
  obs: Array<Observation | FeedingObservation>;
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
  obsDatetime: string;
  concept: {
    uuid: string;
    display?: string;
    name?: {
      uuid: string;
      name: string;
    };
  };
  groupMembers?: Array<ObsGroup>;
  value: any;
  location: OpenmrsResource;
  status: string;
  voided?: boolean;
}

export interface FeedingObservation extends Observation {
  value: ObsValue;
}

export interface ObsValue {
  uuid: string;
  name: {
    uuid: string;
    name: string;
  };
  names: Array<ObsValueName>;
}

export interface ObsValueName {
  uuid: string;
  conceptNameType?: string;
  name?: string;
}

export interface ObsGroup {
  uuid: string;
  display: string;
  concept: OpenmrsResource;
  person: OpenmrsResource;
  obsDatetime: string;
  accessionNumber?: any;
  obsGroup: OpenmrsResource;
  valueCodedName?: any;
  groupMembers?: any;
  comment?: any;
  location: OpenmrsResource;
  order?: any;
  encounter: OpenmrsResource;
  voided: boolean;
  value: {
    uuid: string;
    display: string;
    name: {
      display: string;
      uuid: string;
      name: string;
    };
    datatype: OpenmrsResource;
    conceptClass: OpenmrsResource;
    set: boolean;
    version?: any;
    retired: boolean;
    names: Array<OpenmrsResource>;
    descriptions: Array<any>;
    mappings: Array<any>;
    answers: Array<any>;
    setMembers: Array<any>;
    attributes: Array<any>;
  };
  valueModifier?: any;
  formFieldPath: string;
  formFieldNamespace: string;
  status: string;
  interpretation?: any;
  referenceRange?: any;
}
