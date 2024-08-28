import { openmrsFetch, useSession, restBaseUrl } from '@openmrs/esm-framework';

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
