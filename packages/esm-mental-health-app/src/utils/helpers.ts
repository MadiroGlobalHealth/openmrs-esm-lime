import { fhirBaseUrl, openmrsFetch, restBaseUrl, userHasAccess } from '@openmrs/esm-framework';

export const useHasRequiredPrivilege = async (privilege: string): Promise<boolean> => {
  const response = await openmrsFetch(`${restBaseUrl}/session`, {
    method: 'GET',
  });
  const session = await response.json();
  const hasPrivilege = userHasAccess(privilege, session?.user);
  return !!hasPrivilege;
};

export function getTotalPatientEncounters(patientUuid: string, encounterTypeUuid: string, formName?: string) {
  let params = `encounterType=${encounterTypeUuid}&patient=${patientUuid}`;
  return openmrsFetch(`${restBaseUrl}/encounter?${params}`).then(({ data }) => {
    if (formName) {
      return data.results.filter((encounter: any) => encounter.form?.name === formName).length;
    }
    return data.results.length;
  });
}

export function getLatestObs(patientUuid: string, conceptUuid: string, encounterTypeUuid?: string) {
  let params = `patient=${patientUuid}&code=${conceptUuid}${
    encounterTypeUuid ? `&encounter.type=${encounterTypeUuid}` : ''
  }`;
  // the latest obs
  params += '&_sort=-date&_count=1';
  return openmrsFetch(`${fhirBaseUrl}/Observation?${params}`).then(({ data }) => {
    return data.entry?.length ? data.entry[0].resource : null;
  });
}

export function getLatestOpenmrsObs(patientUuid: string, conceptUuid: string, encounterTypeUuid?: string) {
  return getLatestObs(patientUuid, conceptUuid, encounterTypeUuid).then((obs) => {
    return obs?.valueCodeableConcept?.coding[0]?.code;
  });
}
