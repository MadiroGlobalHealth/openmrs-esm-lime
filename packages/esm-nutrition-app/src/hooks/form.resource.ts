import { openmrsFetch, restBaseUrl } from "@openmrs/esm-framework";
import useSWR from "swr";


export function useForm(formName: string) {
  const { data, error, isLoading } = useSWR(`${restBaseUrl}/o3/forms/${formName}`, openmrsFetch);

  return {
    form: data,
    error,
    isLoading,
  };
}
