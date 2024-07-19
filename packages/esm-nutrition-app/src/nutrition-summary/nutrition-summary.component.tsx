import React from 'react';
import { EmptyState } from '../empty-state/empty-state.component';
import { useTranslation } from 'react-i18next';

interface NutritionSummaryProps {
  patientUuid: string;
}

const NutritionSummary: React.FC<NutritionSummaryProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const nutritionSummaryText = t('nutritionSummary', 'Nutrition Summary');

  return <EmptyState displayText={nutritionSummaryText} headerTitle={nutritionSummaryText} />;
}

export default NutritionSummary;
