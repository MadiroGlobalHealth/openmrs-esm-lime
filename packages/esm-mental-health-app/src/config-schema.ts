import { Type } from '@openmrs/esm-framework';

export const configSchema = {
  concepts: {
    visitQueueNumberAttributeUuid: {
      _type: Type.String,
      _description: 'The UUID of the visit attribute that contains the visit queue number.',
      _default: 'c61ce16f-272a-41e7-9924-4c555d0932c5',
    },
  },
  daysOfTheWeek: {
    _type: Type.Array,
    _description: 'Configurable days of the week',
    _default: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  },
  patientIdentifierType: {
    _type: Type.String,
    _description: 'The name of the patient identifier type to be used for the patient identifier field',
    _default: '',
  },
};

export interface ConfigObject {
  concepts: {
    visitQueueNumberAttributeUuid: string;
  };
  daysOfTheWeek: Array<string>;
  patientIdentifierType: string;
}
