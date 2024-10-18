import React, { useCallback, useMemo } from 'react';
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
import { CardHeader, ErrorState } from '@openmrs/esm-patient-common-lib';
import { formatDate, useLayoutType, isDesktop as desktopLayout } from '@openmrs/esm-framework';
import { EmptyState } from '../empty-state/empty-state.component';
import { usePatientNutrition } from '../hooks/nutrition.resource';
import { launchClinicalViewForm, mealSymbol } from '../utils/helpers';
import { type Encounter } from '../types';
import { useForm } from '../hooks/form.resource';
import { mealAmountConcepts, mealRemarkConcepts, nutritionFormName } from '../constants';
import styles from './nutrition-summary.scss';

interface NutritionSummaryProps {
  patientUuid: string;
}

const NutritionSummary: React.FC<NutritionSummaryProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const nutritionSummaryText = t('nutritionSummary', 'Nutrition Summary');
  const layout = useLayoutType();
  const isTablet = layout === 'tablet';
  const isDesktop = desktopLayout(layout);
  const { form, isLoading: formIsLoading } = useForm(nutritionFormName);
  const { nutritionData, error, isLoading, mutate } = usePatientNutrition(patientUuid);

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
          key: 'encounterDate',
          header: t('date', 'Date'),
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
    return mealAmountConcepts.map((mealAmountConcept, index) => {
      let mealNumber = (index % 10) + 1;
      const row = { id: mealAmountConcept, encounterDate: `Meal ${mealNumber}` };
      nutritionData?.forEach((encounter) => {
        row[encounter.uuid] = getRowData(encounter, mealAmountConcept, index);
      });
      return row;
    });
  }, [nutritionData]);

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
              {t('add', 'Add')}
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
