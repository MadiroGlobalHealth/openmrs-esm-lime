import React from 'react';
import { Button, Layer, Tile } from '@carbon/react';
import { Trans, useTranslation } from 'react-i18next';
import { EmptyDataIllustration } from './empty-data-illustration.component';
import { useLayoutType } from '@openmrs/esm-framework';
import styles from './empty-state.scss';

export interface EmptyStateProps {
  displayText: string;
  launchForm?(): void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ displayText, launchForm }) => {
  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';

  return (
    <Layer>
      <Tile className={styles.tile}>
        <div className={isTablet ? styles.tabletHeading : styles.desktopHeading}>
          <h4>{displayText}</h4>
        </div>
        <EmptyDataIllustration />
        <p className={styles.content}>
          <Trans i18nKey="emptyStateText" displayText={displayText}>
            There are no <span className={styles.displayText}>{{ displayText } as any}</span> to display
          </Trans>
        </p>
        <p className={styles.action}>
          {launchForm && (
            <Button onClick={() => launchForm()} kind="ghost" size={isTablet ? 'lg' : 'sm'}>
              {t('Record')} {displayText.toLowerCase()}
            </Button>
          )}
        </p>
      </Tile>
    </Layer>
  );
};
