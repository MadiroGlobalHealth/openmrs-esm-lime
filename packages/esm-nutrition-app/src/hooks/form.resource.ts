import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import { type Form } from '@openmrs/esm-patient-common-lib';
import useSWR from 'swr';

export function useForm(formUuid: string) {
  const { data, error, isLoading } = useSWR<{ data: Form }, Error>(
    `${restBaseUrl}/form/${formUuid}?v=full`,
    openmrsFetch,
  );

  return {
    form: data?.data,
    error,
    isLoading,
  };
}
