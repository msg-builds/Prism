import { CoreObjectNameSingular } from 'twenty-shared/types';

import { useIsFeatureEnabled } from '@/workspace/hooks/useIsFeatureEnabled';
import { FeatureFlagKey } from '~/generated-metadata/graphql';

// Objects whose screens a workspace feature flag currently hides; their records stay intact
export const useFeatureHiddenObjectNameSingulars = (): string[] => {
  const isDashboardsEnabled = useIsFeatureEnabled(
    FeatureFlagKey.IS_DASHBOARDS_ENABLED,
  );

  return isDashboardsEnabled ? [] : [CoreObjectNameSingular.Dashboard];
};
