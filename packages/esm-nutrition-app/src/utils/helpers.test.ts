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
  const form = {
    name: 'Test Form',
    uuid: 'test-form-uuid',
    version: '1',
    published: true,
    retired: false,
    resources: [],
  } as any;
  const patientUuid = 'patient-uuid';

  beforeEach(() => {
    vi.mocked(launchWorkspace2).mockClear();
  });

  it('launches workspace with correct props in add mode', () => {
    launchClinicalViewForm(form, patientUuid);

    expect(launchWorkspace2).toHaveBeenCalledWith(
      'patient-form-entry-workspace',
      {
        form,
        encounterUuid: undefined,
        additionalProps: { mode: 'enter' },
      },
      { patientUuid },
    );
  });

  it('launches workspace with correct props in edit mode', () => {
    const encounterUuid = 'encounter-uuid';
    launchClinicalViewForm(form, patientUuid, 'edit', encounterUuid);

    expect(launchWorkspace2).toHaveBeenCalledWith(
      'patient-form-entry-workspace',
      {
        form,
        encounterUuid,
        additionalProps: { mode: 'edit' },
      },
      { patientUuid },
    );
  });

  it('passes the full form object so workspace can read form.uuid without errors', () => {
    launchClinicalViewForm(form, patientUuid, 'add');

    const [, workspaceProps] = vi.mocked(launchWorkspace2).mock.calls[0];
    expect((workspaceProps as any).form).toBeDefined();
    expect((workspaceProps as any).form.uuid).toBe('test-form-uuid');
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
