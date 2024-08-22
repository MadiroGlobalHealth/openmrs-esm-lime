import { useSession } from '@openmrs/esm-framework';

export const useRequiredPrivilege = (privilege: string): boolean => {
  const session = useSession();
  const privileges = session?.user?.privileges?.map((privilege) => privilege.display);

  return privileges.includes(privilege);
};
