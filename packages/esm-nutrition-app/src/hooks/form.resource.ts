import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import { type FormSchema } from '@openmrs/esm-form-engine-lib';
import useSWR from 'swr';

export function useForm(formName: string) {
  const { data, error, isLoading } = useSWR<{ data: FormSchema }, Error>(
    `${restBaseUrl}/o3/forms/${formName}`,
    openmrsFetch,
  );

  return {
    form: data?.data,
    error,
    isLoading,
  };
}
