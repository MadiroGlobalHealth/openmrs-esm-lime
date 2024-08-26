import React, { useCallback } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import {
  Button,
  DataTable,
  DataTableSkeleton,
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
import styles from './nutrition-summary.scss';
import { usePatientNutrition } from '../hooks/nutrition.resource';
import { launchClinicalViewForm } from '../helpers/helpers';
import { type Encounter } from '../types';
import { useForm } from '../hooks/form.resource';
import {
  mealAmountTaken1,
  mealAmountTaken10,
  mealAmountTaken2,
  mealAmountTaken3,
  mealAmountTaken4,
  mealAmountTaken5,
  mealAmountTaken6,
  mealAmountTaken7,
  mealAmountTaken8,
  mealAmountTaken9,
  mealRemarkConcept1,
  mealRemarkConcept10,
  mealRemarkConcept2,
  mealRemarkConcept3,
  mealRemarkConcept4,
  mealRemarkConcept5,
  mealRemarkConcept6,
  mealRemarkConcept7,
  mealRemarkConcept8,
  mealRemarkConcept9,
  nutritionFormUuid,
} from '../constants';

interface NutritionSummaryProps {
  patientUuid: string;
}

const NutritionSummary: React.FC<NutritionSummaryProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const nutritionSummaryText = t('nutritionSummary', 'Nutrition Summary');
  const layout = useLayoutType();
  const isTablet = layout === 'tablet';
  const isDesktop = desktopLayout(layout);
  const { form, isLoading: formIsLoading } = useForm(nutritionFormUuid);
  const { nutritionData, error, isLoading, mutate } = usePatientNutrition(patientUuid);

  const launchNutritionForm = useCallback(
    () => launchClinicalViewForm(form, patientUuid, mutate, 'add'),
    [form, patientUuid, mutate],
  );

  const generateHeaders = () => {
    return [
      ...[
        {
          key: 'encounterDate',
          header: t('date', 'Date'),
        },
      ],
      ...(nutritionData ?? []).map((encounter: Encounter) => ({
        key: encounter.uuid,
        header: formatDate(new Date(encounter.encounterDatetime)), // TODO - format date to dd-mm-yyyy
      })),
    ];
  };
  const tableHeaders = nutritionData && generateHeaders();

  const tableRows = React.useMemo(() => {
    const mealAmountConcepts = [
      mealAmountTaken1,
      mealAmountTaken2,
      mealAmountTaken3,
      mealAmountTaken4,
      mealAmountTaken5,
      mealAmountTaken6,
      mealAmountTaken7,
      mealAmountTaken8,
      mealAmountTaken9,
      mealAmountTaken10,
    ];

    const mealRemarkConcepts = [
      mealRemarkConcept1,
      mealRemarkConcept2,
      mealRemarkConcept3,
      mealRemarkConcept4,
      mealRemarkConcept5,
      mealRemarkConcept6,
      mealRemarkConcept7,
      mealRemarkConcept8,
      mealRemarkConcept9,
      mealRemarkConcept10,
    ];

    return mealAmountConcepts.map((mealAmountConcept, index) => {
      let mealNumber = (index % 10) + 1;
      const row = { id: mealAmountConcept, encounterDate: `Meal ${mealNumber}` };
      nutritionData?.map((encounter) => {
        let obs = encounter.obs.find((obs) => obs.concept.uuid === mealAmountConcept);
        row[encounter.uuid] = {
          mealTaken: obs?.value?.name?.name ?? '--',
          mealRemark:
            encounter.obs.find((obs) => obs.concept.uuid === mealRemarkConcepts[index])?.value?.name?.name.charAt(0) ??
            '--',
        };
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
      <div className={styles.widgetCard}>
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
        <DataTable rows={tableRows} headers={tableHeaders} isSortable size={isTablet ? 'lg' : 'sm'} useZebraStyles>
          {({ rows, headers, getHeaderProps, getTableProps }) => (
            <TableContainer>
              <Table aria-label="nutrition summary" {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {headers.map((header, index) => (
                      <TableHeader
                        colSpan={index === 0 ? 1 : 2}
                        className={classNames(styles.productiveHeading01, styles.text02, styles.widgetTableHeader)}
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
                      {row.cells.map((cell, index) =>
                        index === 0 ? (
                          <TableCell key={cell.id}>{cell.value?.content ?? cell.value}</TableCell>
                        ) : (
                          <>
                            <TableCell key={cell.id}>
                              {cell.value?.content?.mealTaken ?? cell.value?.mealTaken}
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
    );
  }
};

const FeedTableCell = ({ interpretation, children }: { interpretation: string; children: React.ReactNode }) => {
  switch (interpretation) {
    case 'critically_high':
      return <TableCell className={styles.criticallyHigh}>{children}</TableCell>;
    case 'critically_low':
      return <TableCell className={styles.criticallyLow}>{children}</TableCell>;
    case 'high':
      return <TableCell className={styles.high}>{children}</TableCell>;
    case 'low':
      return <TableCell className={styles.low}>{children}</TableCell>;
    default:
      return <TableCell>{children}</TableCell>;
  }
};

export default NutritionSummary;
