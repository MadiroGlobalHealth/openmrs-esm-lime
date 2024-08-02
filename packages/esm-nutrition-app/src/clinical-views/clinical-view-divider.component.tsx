import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Information } from '@carbon/react/icons';
import { Tooltip } from '@carbon/react';
import { ExtensionSlot } from '@openmrs/esm-framework';
import { type DashboardGroupExtensionProps, registerNavGroup } from '@openmrs/esm-patient-common-lib';
import styles from './clinical-view-divider.scss';

export const ClinicalViewDivider: React.FC<DashboardGroupExtensionProps> = ({ title, basePath }) => {
  const slotName = 'clinical-view-section';
  const { t } = useTranslation();
  useEffect(() => {
    registerNavGroup(slotName);
  }, [slotName]);
  return (
    <>
      <div className={styles.container}>
        <span>{t('clinicalViews', 'Clinical views')}</span>
        <Tooltip
          align="top"
          label={t('customViews', "Clinical views tailored to patients' conditions and enrolled care programs.")}
        >
          <button style={{ border: 'none' }} className="sb-tooltip-trigger" type="button">
            <Information />
          </button>
        </Tooltip>
      </div>
      <ExtensionSlot style={{ width: '100%', minWidth: '15rem' }} name={slotName ?? title} state={{ basePath }} />
    </>
  );
};

export default ClinicalViewDivider;
