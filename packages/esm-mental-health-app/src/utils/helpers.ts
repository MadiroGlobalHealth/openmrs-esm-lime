import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';

export const hasRequiredPrivilege = async (privilege: string): Promise<boolean> => {
  const privileges = await fetchPrivileges();
  return privileges.includes(privilege);
};

async function fetchPrivileges(): Promise<Array<string>> {
  const response = await openmrsFetch(`${restBaseUrl}/session`, {
    method: 'GET',
  });
  const data = await response.json();
  return data?.user?.privileges?.map((p) => p.display) || [];
}

export function getTotalPatientEncounters(patientUuid: string, encounterTypeUuid: string, formName?: string) {
  let params = `encounterType=${encounterTypeUuid}&patient=${patientUuid}`;
  return openmrsFetch(`${restBaseUrl}/encounter?${params}`).then(({ data }) => {
    if (formName) {
      return data.results.filter((encounter: any) => encounter.form?.name === formName).length;
    }
    return data.results.length;
  });
}
