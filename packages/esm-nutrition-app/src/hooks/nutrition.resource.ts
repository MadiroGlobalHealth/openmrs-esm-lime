import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import useSWR from 'swr';

export const encounterRepresentation =
  'custom:(uuid,encounterDatetime,encounterType,location:(uuid,name),' +
  'patient:(uuid,display,age,identifiers,person),encounterProviders:(uuid,provider:(uuid,name)),' +
  'obs:(uuid,obsDatetime,voided,groupMembers,concept:(uuid,name:(uuid,name)),value:(uuid,name:(uuid,name),' +
  'names:(uuid,conceptNameType,name))),form:(uuid,name))';

export const nutritionEncounterTypeName = 'Nutrition';

export function usePatientNutrition(patientUuid: string) {
  const nutritionUrl = `${restBaseUrl}/encounter?encounterType=${nutritionEncounterTypeName}&patient=${patientUuid}&v=${encounterRepresentation}`;

  const { data, error, isLoading, mutate } = useSWR(nutritionUrl, openmrsFetch);

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}