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

// Date of the patient's first non-cancelled appointment on a later day than fromDate, or null if none
export function getNextAppointmentDate(patientUuid: string, fromDate: string | Date): Promise<Date | null> {
  const startOfNextDay = new Date(fromDate);
  startOfNextDay.setHours(24, 0, 0, 0);
  return openmrsFetch(`${restBaseUrl}/appointments/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { patientUuid, startDate: startOfNextDay.toISOString() },
  }).then(({ data }) => {
    const dates = (data ?? [])
      .filter((appointment: any) => appointment.status !== 'Cancelled')
      .map((appointment: any) => new Date(appointment.startDateTime))
      .filter((date: Date) => date >= startOfNextDay)
      .sort((a: Date, b: Date) => a.getTime() - b.getTime());
    return dates[0] ?? null;
  });
}

export function getLatestOpenmrsObs(patientUuid: string, conceptUuid: string, encounterTypeUuid?: string) {
  return getLatestObs(patientUuid, conceptUuid, encounterTypeUuid).then((obs) => {
    return obs?.valueCodeableConcept?.coding[0]?.code;
  });
}
