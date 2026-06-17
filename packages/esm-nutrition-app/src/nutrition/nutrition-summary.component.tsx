import React, { useCallback, useEffect, useRef, useMemo } from 'react';
import { formatDate, getGlobalStore, useLayoutType, isDesktop as desktopLayout } from '@openmrs/esm-framework';
import { CardHeader, ErrorState } from '@openmrs/esm-patient-common-lib';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import {
  Button,
  DataTable,
  DataTableSkeleton,
  Link,
  SkeletonText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from '@carbon/react';
import { Add } from '@carbon/react/icons';
import { EmptyState } from '../empty-state/empty-state.component';
import { launchClinicalViewForm, mealSymbol } from '../utils/helpers';
import { type Encounter } from '../types';
import { usePatientNutrition } from '../hooks/nutrition.resource';
import { useForm } from '../hooks/form.resource';
import { feedingInformationConcept, mealAmountConcepts, mealRemarkConcepts, nutritionFormUuid } from '../constants';
import styles from './nutrition-summary.scss';

interface NutritionSummaryProps {
  patientUuid: string;
}

interface MealItem {
  mealTakenSymbol: string;
  mealRemark: string;
}

interface TableRowData {
  id: string;
  meal: string;
  [key: string]: MealItem | string;
}

const NutritionSummary: React.FC<NutritionSummaryProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const nutritionSummaryText = t('Nutrition Summary', 'Nutrition Summary');
  const layout = useLayoutType();
  const isTablet = layout === 'tablet';
  const isDesktop = desktopLayout(layout);
  const { form, isLoading: formIsLoading } = useForm(nutritionFormUuid);
  const { nutritionData, error, isLoading, mutate } = usePatientNutrition(patientUuid);

  const formWorkspaceWasOpen = useRef(false);

  useEffect(() => {
    const store = getGlobalStore<{ openedWindows: Array<{ openedWorkspaces: Array<{ workspaceName: string }> }> }>(
      'workspace2',
    );
    const unsubscribe = store.subscribe((state) => {
      const isOpen = state.openedWindows?.some((w) =>
        w.openedWorkspaces?.some((ws) => ws.workspaceName === 'patient-form-entry-workspace'),
      );
      if (formWorkspaceWasOpen.current && !isOpen) {
        mutate();
      }
      formWorkspaceWasOpen.current = isOpen ?? false;
    });
    return unsubscribe;
  }, [mutate]);

  const launchNutritionForm = useCallback(() => {
    if (!form) return;
    launchClinicalViewForm(form, patientUuid, 'add');
  }, [form, patientUuid]);

  const editNutritionEncounterForm = (encounterUuid: string) => {
    if (!form) return;
    launchClinicalViewForm(form, patientUuid, 'edit', encounterUuid);
  };

  const tableHeaders = useMemo(() => {
    if (!nutritionData) return [];
    return [
      {
        key: 'meal',
        header: t('Date'),
      },
      ...(nutritionData ?? []).map((encounter: Encounter) => ({
        key: encounter.uuid,
        header: formatDate(new Date(encounter.encounterDatetime), {
          time: false,
          noToday: true,
        }),
      })),
    ];
  }, [nutritionData, t]);

  const getRowData = (encounter: Encounter, mealAmountConcept: string, index: number): MealItem => {
    const obs = (encounter.obs as any[]).find((o: any) => o.concept.uuid === mealAmountConcept);
    const remarkObs = (encounter.obs as any[]).find((o: any) => o.concept.uuid === mealRemarkConcepts[index]);
    return {
      mealTakenSymbol: mealSymbol(obs?.value?.name?.name ?? ''),
      mealRemark: remarkObs?.value?.name?.name?.charAt(0) ?? '',
    };
  };

  const tableRows = useMemo(() => {
    const processGroupMember = (groupMember: any, mealIndex: number): Partial<MealItem> => {
      const amountMatch = /rfe-forms-amountTaken(?:_(\d+))?/.exec(groupMember?.formFieldPath ?? '');
      const remarkMatch = /rfe-forms-remark(?:_(\d+))?/.exec(groupMember?.formFieldPath ?? '');
      if (!amountMatch && !remarkMatch) return {};
      const amountIndex = amountMatch?.[1] ? Number.parseInt(amountMatch[1], 10) : 0;
      const remarkIndex = remarkMatch?.[1] ? Number.parseInt(remarkMatch[1], 10) : 0;
      const result: Partial<MealItem> = {};
      if (amountMatch && amountIndex === mealIndex)
        result.mealTakenSymbol = mealSymbol(groupMember.value?.name?.name ?? '');
      if (remarkMatch && remarkIndex === mealIndex) result.mealRemark = groupMember.value?.name?.name.charAt(0) ?? '';
      return result;
    };

    const extractObsRow = (encounter: Encounter, mealIndex: number): MealItem => {
      const feedingInformationObs = (encounter.obs as any[]).filter(
        (o: any) => o.concept.uuid === feedingInformationConcept,
      );
      const groupMembers = feedingInformationObs.flatMap((o: any) => o.groupMembers ?? []);
      if (groupMembers.length === 0) return getRowData(encounter, mealAmountConcepts[mealIndex], mealIndex);
      const obsRow: MealItem = { mealTakenSymbol: '', mealRemark: '' };
      for (const gm of groupMembers) {
        const partial = processGroupMember(gm, mealIndex);
        if (partial.mealTakenSymbol) obsRow.mealTakenSymbol = partial.mealTakenSymbol;
        if (partial.mealRemark) obsRow.mealRemark = partial.mealRemark;
      }
      return obsRow;
    };
    const feedingRows: TableRowData[] = [];
    // Build table rows from feeding observations
    for (let mealIndex = 0; mealIndex < 10; mealIndex++) {
      const row: TableRowData = {
        id: `meal-${mealIndex + 1}`,
        meal: `${t('Meal')} ${mealIndex + 1}`,
      };

      // Build feeding rows
      (nutritionData ?? []).forEach((encounter: Encounter) => {
        row[encounter.uuid] = extractObsRow(encounter, mealIndex);
      });

      feedingRows.push(row);
    }

    return feedingRows;
  }, [nutritionData, t]);

  if (isLoading) return <DataTableSkeleton role="progressbar" compact={isDesktop} zebra />;
  if (error) return <ErrorState error={error} headerTitle={nutritionSummaryText} />;
  if ((nutritionData?.length ?? 0) === 0)
    return <EmptyState displayText={nutritionSummaryText} launchForm={form ? launchNutritionForm : undefined} />;
  if ((nutritionData?.length ?? 0) > 0) {
    return (
      <div className={styles.nutritionWidgetCard}>
        <CardHeader title={nutritionSummaryText}>
          {formIsLoading && <SkeletonText />}
          {form && (
            <Button
              kind="ghost"
              renderIcon={(props: any) => <Add size={16} {...props} />}
              iconDescription="Add Nutrition Feeding"
              onClick={launchNutritionForm}
            >
              {t('Add')}
            </Button>
          )}
        </CardHeader>

        <div className={styles.tableContainer}>
          <DataTable rows={tableRows} headers={tableHeaders} isSortable size={isTablet ? 'lg' : 'sm'} useZebraStyles>
            {(renderProps: any) => {
              const { rows, headers, getHeaderProps, getTableProps } = renderProps;
              return (
                <TableContainer>
                  <Table
                    aria-label="nutrition summary"
                    {...getTableProps()}
                    className={classNames(styles.nutritionTableCell)}
                  >
                    <TableHead>
                      <TableRow>
                        {headers.map((header: any, index: number) => (
                          <TableHeader
                            key={header.key}
                            colSpan={index === 0 ? 1 : 2}
                            className={classNames(
                              styles.productiveHeading01,
                              styles.text02,
                              styles.widgetTableHeader,
                              index === 0 ? styles.stickyTableColumn : '',
                            )}
                            {...getHeaderProps({
                              header,
                              isSortable: false,
                            })}
                          >
                            {index === 0 ? (
                              (header.header?.content ?? header.header)
                            ) : (
                              <Link
                                style={{ cursor: 'pointer' }}
                                onClick={(e: React.MouseEvent) => {
                                  e.preventDefault();
                                  editNutritionEncounterForm(header.key);
                                }}
                              >
                                {header.header?.content ?? header.header}
                              </Link>
                            )}
                          </TableHeader>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row: any) => (
                        <TableRow key={row.id}>
                          {row.cells.map((cell: any, index: number) =>
                            index === 0 ? (
                              <TableCell key={cell.id} className={styles.stickyTableColumn}>
                                {cell.value?.content ?? cell.value}
                              </TableCell>
                            ) : (
                              <React.Fragment key={cell.id}>
                                <TableCell
                                  className={styles.mealTaken}
                                  data-status={cell.value?.content?.mealTakenSymbol ?? cell.value?.mealTakenSymbol}
                                >
                                  {cell.value?.content?.mealTakenSymbol ?? cell.value?.mealTakenSymbol}
                                </TableCell>
                                <TableCell>{cell.value?.content?.mealRemark ?? cell.value?.mealRemark}</TableCell>
                              </React.Fragment>
                            ),
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              );
            }}
          </DataTable>
        </div>
      </div>
    );
  }
  return null;
};

export default NutritionSummary;
