import { isLayoutCustomizationModeEnabledState } from '@/layout-customization/states/isLayoutCustomizationModeEnabledState';
import { PageLayoutEditModeProviderContext } from '@/page-layout/contexts/PageLayoutEditModeContext';
import { useWorkspaceSurface } from '@/ui/layout/hooks/useWorkspaceSurface';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useIsFeatureEnabled } from '@/workspace/hooks/useIsFeatureEnabled';
import { type ReactNode } from 'react';
import { FeatureFlagKey } from '~/generated-metadata/graphql';

type RecordPageLayoutEditModeProviderProps = {
  children: ReactNode;
};

export const RecordPageLayoutEditModeProvider = ({
  children,
}: RecordPageLayoutEditModeProviderProps) => {
  const isLayoutCustomizationModeEnabled = useAtomStateValue(
    isLayoutCustomizationModeEnabledState,
  );

  const isInSidePanel = useWorkspaceSurface().type === 'side-panel';
  const isRecordPageLayoutEditingEnabled = useIsFeatureEnabled(
    FeatureFlagKey.IS_RECORD_PAGE_LAYOUT_EDITING_ENABLED,
  );

  return (
    <PageLayoutEditModeProviderContext
      value={{
        isInEditMode:
          isLayoutCustomizationModeEnabled &&
          !isInSidePanel &&
          isRecordPageLayoutEditingEnabled,
      }}
    >
      {children}
    </PageLayoutEditModeProviderContext>
  );
};
