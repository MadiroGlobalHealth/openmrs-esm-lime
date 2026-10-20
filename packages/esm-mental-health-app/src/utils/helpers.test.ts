import { vi } from 'vitest';
import { openmrsFetch } from '@openmrs/esm-framework';
import { getNextAppointmentDate } from './helpers';

vi.mock('@openmrs/esm-framework', () => ({
  openmrsFetch: vi.fn(),
  restBaseUrl: 'http://localhost:8080/openmrs/ws/rest/v1',
}));

describe('getNextAppointmentDate', () => {
  const patientUuid = 'patient-uuid';
  const formDate = new Date(2026, 9, 20, 10, 30);

  const mockAppointments = (appointments: Array<{ startDateTime: number; status: string }>) =>
    vi.mocked(openmrsFetch).mockResolvedValue({ data: appointments } as any);

  beforeEach(() => {
    vi.mocked(openmrsFetch).mockReset();
  });

  it('searches the patient appointments from the start of the day after the form date', async () => {
    mockAppointments([]);

    await getNextAppointmentDate(patientUuid, formDate);

    expect(openmrsFetch).toHaveBeenCalledWith(
      'http://localhost:8080/openmrs/ws/rest/v1/appointments/search',
      expect.objectContaining({
        method: 'POST',
        body: { patientUuid, startDate: new Date(2026, 9, 21).toISOString() },
      }),
    );
  });

  it('returns the earliest appointment after the form date', async () => {
    mockAppointments([
      { startDateTime: new Date(2026, 10, 3, 9).getTime(), status: 'Scheduled' },
      { startDateTime: new Date(2026, 9, 27, 9).getTime(), status: 'Scheduled' },
    ]);

    await expect(getNextAppointmentDate(patientUuid, formDate)).resolves.toEqual(new Date(2026, 9, 27, 9));
  });

  it('ignores cancelled appointments and appointments on the form date', async () => {
    mockAppointments([
      { startDateTime: new Date(2026, 9, 20, 15).getTime(), status: 'Scheduled' },
      { startDateTime: new Date(2026, 9, 22, 9).getTime(), status: 'Cancelled' },
      { startDateTime: new Date(2026, 9, 29, 9).getTime(), status: 'Scheduled' },
    ]);

    await expect(getNextAppointmentDate(patientUuid, formDate)).resolves.toEqual(new Date(2026, 9, 29, 9));
  });

  it('accepts the form date as an ISO string, as visit.startDatetime is', async () => {
    mockAppointments([{ startDateTime: new Date(2026, 9, 27, 9).getTime(), status: 'Scheduled' }]);

    await expect(getNextAppointmentDate(patientUuid, formDate.toISOString())).resolves.toEqual(
      new Date(2026, 9, 27, 9),
    );
  });

  it('returns null when there is no later appointment', async () => {
    mockAppointments([]);

    await expect(getNextAppointmentDate(patientUuid, formDate)).resolves.toBeNull();
  });
});
