import React from 'react';
import { EmptyState } from '../empty-state/empty-state.component';
import { useTranslation } from 'react-i18next';

interface MentalHealthSummaryProps {
  patientUuid: string;
}

const MentalHealthSummary: React.FC<MentalHealthSummaryProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const MentalHealthText = t('Mental Health');

  return <EmptyState displayText={MentalHealthText} />;
};

export default MentalHealthSummary;
