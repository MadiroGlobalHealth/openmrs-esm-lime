import React, { useCallback, useMemo } from 'react';
import { formatDate, useLayoutType, isDesktop as desktopLayout } from '@openmrs/esm-framework';
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
import { feedingInformationConcept, mealAmountConcepts, mealRemarkConcepts, nutritionFormName } from '../constants';
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
  const { form, isLoading: formIsLoading } = useForm(nutritionFormName);
  const { nutritionData, error, isLoading, mutate } = usePatientNutrition(patientUuid);
  console.log('nutritionData', nutritionData);

  const launchNutritionForm = useCallback(
    () => launchClinicalViewForm(form, patientUuid, mutate, 'add'),
    [form, patientUuid, mutate],
  );

  const editNutritionEncounterForm = (encounterUuid: string) => {
    launchClinicalViewForm(form, patientUuid, mutate, 'edit', encounterUuid);
  };

  const tableHeaders = useMemo(() => {
    if (!nutritionData) return [];
    return [
      ...[
        {
          key: 'meal',
          header: t('Date'),
        },
      ],
      ...(nutritionData ?? []).map((encounter: Encounter) => ({
        key: encounter.uuid,
        header: formatDate(new Date(encounter.encounterDatetime), {
          time: false,
          noToday: true,
        }),
      })),
    ];
  }, [nutritionData, t]);

  const getRowData = (encounter, mealAmountConcept, index) => {
    let obs = encounter.obs.find((obs) => obs.concept.uuid === mealAmountConcept);
    return {
      mealTakenSymbol: mealSymbol(obs?.value?.name?.name ?? ''),
      mealRemark:
        encounter.obs.find((obs) => obs.concept.uuid === mealRemarkConcepts[index])?.value?.name?.name.charAt(0) ?? '',
    };
  };

  const tableRows = useMemo(() => {
    const feedingRows: TableRowData[] = [];
    // Build table rows from feeding observations
    Array.from({ length: 10 }, (_, mealIndex) => {
      const row: TableRowData = {
        id: `meal-${mealIndex + 1}`,
        meal: `${t('Meal')} ${mealIndex + 1}`,
      };
      // Build feeding rows
      nutritionData?.forEach((encounter) => {
        const feedingInformationObs = encounter.obs.filter((obs) => obs.concept.uuid === feedingInformationConcept);
        if (feedingInformationObs.length > 0) {
          feedingInformationObs.forEach((obs) => {
            if (obs.groupMembers) {
              for (let i = 0; i < obs.groupMembers.length; i++) {
                const groupMember = obs.groupMembers[i];
                const obsRow = { mealTakenSymbol: '', mealRemark: '' };
                const amountMatch = groupMember?.formFieldPath.match(/rfe-forms-amountTaken(?:_(\d+))?/);
                const remarkMatch = groupMember?.formFieldPath.match(/rfe-forms-remark(?:_(\d+))?/);

                if (!amountMatch && !remarkMatch) continue;

                // Handle case where no amount or remark is found for the first meal
                if (amountMatch && remarkMatch && mealIndex === 0) {
                  if (amountMatch[1] === undefined) {
                    obsRow.mealTakenSymbol = mealSymbol(groupMember.value?.name?.name ?? '');
                  }

                  if (remarkMatch[1] === undefined) {
                    obsRow.mealRemark = groupMember.value?.name?.name.charAt(0) ?? '';
                  }

                  console.log('First meal match', obsRow);
                  row[encounter.uuid] = obsRow;
                  continue;
                } else {
                  // Skip if neither matches
                  if (
                    !(amountMatch && parseInt(amountMatch[1], 10) - 1 === mealIndex) &&
                    !(remarkMatch && parseInt(remarkMatch[1], 10) - 1 === mealIndex)
                  ) {
                    continue;
                  }

                  // Check for amount match
                  if (amountMatch && parseInt(amountMatch[1], 10) - 1 === mealIndex) {
                    obsRow.mealTakenSymbol = mealSymbol(groupMember.value?.name?.name ?? '');
                  }
                  // Check for remark match
                  if (remarkMatch && parseInt(remarkMatch[1], 10) - 1 === mealIndex) {
                    obsRow.mealRemark = groupMember.value?.name?.name.charAt(0) ?? '';
                  }
                }
                row[encounter.uuid] = obsRow;
              }
            }
          });
        } else {
          // Legacy form support
          row[encounter.uuid] = getRowData(encounter, mealAmountConcepts[mealIndex], mealIndex);
        }
      });
      feedingRows.push(row);
    });

    console.log('feedingRows', feedingRows);
    return feedingRows;
  }, [nutritionData, t]);

  if (isLoading) return <DataTableSkeleton role="progressbar" compact={isDesktop} zebra />;
  if (error) return <ErrorState error={error} headerTitle={nutritionSummaryText} />;
  if (nutritionData?.length == 0)
    return <EmptyState displayText={nutritionSummaryText} launchForm={launchNutritionForm} />;
  if (nutritionData?.length > 0) {
    return (
      <div className={styles.nutritionWidgetCard}>
        <CardHeader title={nutritionSummaryText}>
          {formIsLoading && <SkeletonText />}
          {form && (
            <Button
              kind="ghost"
              renderIcon={(props) => <Add size={16} {...props} />}
              iconDescription="Add Nutrition Feeding"
              onClick={launchNutritionForm}
            >
              {t('Add')}
            </Button>
          )}
        </CardHeader>

        <div className={styles.tableContainer}>
          <DataTable rows={tableRows} headers={tableHeaders} isSortable size={isTablet ? 'lg' : 'sm'} useZebraStyles>
            {({ rows, headers, getHeaderProps, getTableProps }) => (
              <TableContainer>
                <Table
                  aria-label="nutrition summary"
                  {...getTableProps()}
                  className={classNames(styles.nutritionTableCell)}
                >
                  <TableHead>
                    <TableRow>
                      {headers.map((header, index) => (
                        <TableHeader
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
                              onClick={(e) => {
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
                    {rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.cells.map((cell, index) =>
                          index === 0 ? (
                            <TableCell key={cell.id} className={styles.stickyTableColumn}>
                              {cell.value?.content ?? cell.value}
                            </TableCell>
                          ) : (
                            <>
                              <TableCell
                                className={styles.mealTaken}
                                key={cell.id}
                                data-status={cell.value?.content?.mealTakenSymbol ?? cell.value?.mealTakenSymbol}
                              >
                                {cell.value?.content?.mealTakenSymbol ?? cell.value?.mealTakenSymbol}
                              </TableCell>
                              <TableCell key={cell.id}>
                                {cell.value?.content?.mealRemark ?? cell.value?.mealRemark}
                              </TableCell>
                            </>
                          ),
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DataTable>
        </div>
      </div>
    );
  }
};

export default NutritionSummary;
