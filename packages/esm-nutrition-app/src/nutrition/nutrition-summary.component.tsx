import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import {
  Button,
  DataTable,
  DataTableSkeleton,
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
import { formatDate, formatDatetime, useLayoutType, isDesktop as desktopLayout } from '@openmrs/esm-framework';
import { EmptyState } from '../empty-state/empty-state.component';
import styles from './nutrition-summary.scss';
import { usePatientNutrition } from '../hooks/nutrition.resource';
import { launchNutritionFeedingForm } from '../helpers/helpers';
import { type Encounter } from '../types';

interface NutritionSummaryProps {
  patientUuid: string;
}

const NutritionSummary: React.FC<NutritionSummaryProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const nutritionSummaryText = t('nutritionSummary', 'Nutrition Summary');
  const layout = useLayoutType();
  const isTablet = layout === 'tablet';
  const isDesktop = desktopLayout(layout);

  const { nutritionData, error, isLoading, mutate } = usePatientNutrition(patientUuid);

  const launchNutritionForm = React.useCallback(() => launchNutritionFeedingForm(patientUuid, 'enter'), [patientUuid]);

  const tableHeaders = [
    {
      key: 'meal1',
      header: t('meal1', 'Meal 1'),
    },
    {
      key: 'meal2',
      header: t('meal2', 'Meal 2'),
    },
    {
      key: 'meal3',
      header: t('meal3', 'Meal 3'),
    },
    {
      key: 'meal4',
      header: t('meal4', 'Meal 4'),
    },
    {
      key: 'meal5',
      header: t('meal5', 'Meal 5'),
    },
    {
      key: 'meal6',
      header: t('meal6', 'Meal 6'),
    },
    {
      key: 'meal7',
      header: t('meal7', 'Meal 7'),
    },
    {
      key: 'meal8',
      header: t('meal8', 'Meal 8'),
    },
  ];

  const tableRows = React.useMemo(() => {
    return nutritionData?.map((nutritionEncounter: Encounter) => ({
      id: nutritionEncounter.uuid,
      meal1: nutritionEncounter.obs[0]?.value?.display ?? '--',
      meal2: nutritionEncounter.obs[1]?.value?.display ?? '--',
      meal3: nutritionEncounter.obs[2]?.value?.display ?? '--',
      meal4: nutritionEncounter.obs[3]?.value?.display ?? '--',
      meal5: nutritionEncounter.obs[4]?.value?.display ?? '--',
      meal6: nutritionEncounter.obs[5]?.value?.display ?? '--',
      meal7: nutritionEncounter.obs[6]?.value?.display ?? '--',
      meal8: nutritionEncounter.obs[7]?.value?.display ?? '--',
      // dateStarted: nutritionEncounter.dateStarted? formatDatetime(new Date(nutritionEncounter.dateStarted)) : '--',
      // dateCompleted: nutritionEncounter.dateCompleted? formatDatetime(new Date(nutritionEncounter.dateCompleted)) : '--',
      // dateEnrolled: nutritionEncounter.dateEnrolled ? formatDatetime(new Date(nutritionEncounter.dateEnrolled)) : '--',
      // status: nutritionEncounter.dateCompleted
      //   ? `${t('completedOn', 'Completed On')} ${formatDate(new Date(nutritionEncounter.dateCompleted))}`
      //   : t('active', 'Active'),
    }));
  }, [nutritionData]);

  if (isLoading) return <DataTableSkeleton role="progressbar" compact={isDesktop} zebra />;
  if (error) return <ErrorState error={error} headerTitle={nutritionSummaryText} />;
  if (nutritionData?.length) {
    return (
      <div className={styles.widgetCard}>
        <CardHeader title={nutritionSummaryText}>
          <span>{nutritionSummaryText}</span>
          <Button
            kind="ghost"
            renderIcon={(props) => <Add size={16} {...props} />}
            iconDescription="Add Nutrition Feeding"
            onClick={launchNutritionForm}
          >
            {t('add', 'Add')}
          </Button>
        </CardHeader>
        <DataTable rows={tableRows} headers={tableHeaders} isSortable size={isTablet ? 'lg' : 'sm'} useZebraStyles>
          {({ rows, headers, getHeaderProps, getTableProps }) => (
            <TableContainer>
              <Table aria-label="programs overview" {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {headers.map((header) => (
                      <TableHeader
                        className={classNames(styles.productiveHeading01, styles.text02)}
                        {...getHeaderProps({
                          header,
                          isSortable: header.isSortable,
                        })}
                      >
                        {header.header?.content ?? header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id}>{cell.value?.content ?? cell.value}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DataTable>
      </div>
    );
  }
  return <EmptyState displayText={nutritionSummaryText} launchForm={launchNutritionForm} />;
};

export default NutritionSummary;
