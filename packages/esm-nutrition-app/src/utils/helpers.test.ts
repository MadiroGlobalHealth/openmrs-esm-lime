import { vi } from 'vitest';
import { launchWorkspace2, openmrsFetch } from '@openmrs/esm-framework';
import dayjs from 'dayjs';
import { launchClinicalViewForm, mealSymbol, getPatientEncounterDates } from './helpers';
import { dateFormat } from '../constants';

vi.mock('@openmrs/esm-framework', () => ({
  openmrsFetch: vi.fn(),
  launchWorkspace2: vi.fn().mockResolvedValue(true),
  restBaseUrl: 'http://localhost:8080/openmrs/ws/rest/v1',
}));

describe('launchClinicalViewForm', () => {
  it('should call launchWorkspace2 with correct parameters', () => {
    const form = { name: 'Test Form', uuid: 'test-form-uuid' } as any;
    const patientUuid = 'patient-uuid';
    const onFormSave = vi.fn();
    const action = 'add';

    launchClinicalViewForm(form, patientUuid, onFormSave, action);

    expect(launchWorkspace2).toHaveBeenCalledWith(
      'patient-form-entry-workspace',
      {
        workspaceTitle: form.name,
        mutateForm: onFormSave,
        formInfo: {
          encounterUuid: undefined,
          formUuid: form.uuid,
          patientUuid: patientUuid,
          visitTypeUuid: '',
          visitUuid: '',
          visitStartDatetime: '',
          visitStopDatetime: '',
          additionalProps: {
            mode: 'enter',
          },
        },
      },
      { patientUuid },
    );
  });
});

describe('mealSymbol', () => {
  it.each([
    ['0%', '-'],
    ['25%', 'X'],
    ['50%', 'XX'],
    ['75%', 'XXX'],
    ['100%', 'XXXX'],
    ['unknown', ''],
  ])('should return correct symbol for %s', (input, expected) => {
    expect(mealSymbol(input)).toBe(expected);
  });
});

describe('getPatientEncounterDates', () => {
  it('should return formatted encounter dates', async () => {
    const patientUuid = 'patient-uuid';
    const encounterTypeUuid = 'encounter-type-uuid';
    const mockData = {
      data: {
        results: [{ encounterDatetime: '2023-01-01T00:00:00.000Z' }, { encounterDatetime: '2023-02-01T00:00:00.000Z' }],
      },
    };

    vi.mocked(openmrsFetch).mockResolvedValue(mockData as any);

    const result = await getPatientEncounterDates(patientUuid, encounterTypeUuid);

    expect(result).toEqual([
      dayjs('2023-01-01T00:00:00.000Z').format(dateFormat),
      dayjs('2023-02-01T00:00:00.000Z').format(dateFormat),
    ]);
  });

  it('should return an empty array if no encounters are found', async () => {
    const patientUuid = 'patient-uuid';
    const encounterTypeUuid = 'encounter-type-uuid';
    const mockData = { data: { results: [] } };

    vi.mocked(openmrsFetch).mockResolvedValue(mockData as any);

    const result = await getPatientEncounterDates(patientUuid, encounterTypeUuid);

    expect(result).toEqual([]);
  });
});
