import { FeatureFlagKey } from 'twenty-shared/types';

type FeatureFlagMetadata = {
  label: string;
  description: string;
  icon: string;
  imagePath?: string;
};

export type PublicFeatureFlag = {
  key: FeatureFlagKey;
  metadata: FeatureFlagMetadata;
};

export const PUBLIC_FEATURE_FLAGS: PublicFeatureFlag[] = [
  {
    key: FeatureFlagKey.IS_REST_METADATA_API_NEW_FORMAT_DIRECT,
    metadata: {
      label: 'New REST Metadata API Format',
      description:
        'Return objects and fields from /rest/metadata without the legacy data.objects / data.fields wrapper. The legacy format will be discontinued on November 15, 2026.',
      icon: 'IconApi',
    },
  },
  {
    key: FeatureFlagKey.IS_DASHBOARDS_ENABLED,
    metadata: {
      label: 'Dashboards',
      description:
        'Show dashboards in the sidebar and let members open and edit them. Turning this off hides them; saved dashboards are kept.',
      icon: 'IconLayoutDashboard',
    },
  },
  {
    key: FeatureFlagKey.IS_CHART_WIDGETS_ENABLED,
    metadata: {
      label: 'Charts',
      description:
        'Show chart widgets on dashboards and allow adding new ones. Turning this off hides charts; their settings are kept.',
      icon: 'IconChartBar',
    },
  },
  {
    key: FeatureFlagKey.IS_RECORD_PAGE_LAYOUT_EDITING_ENABLED,
    metadata: {
      label: 'Record page layout editing',
      description:
        'Let members with the Layouts permission rearrange tabs and widgets on record pages. Turning this off keeps the current layouts.',
      icon: 'IconPerspective',
    },
  },
  ...(process.env.CLOUDFLARE_API_KEY
    ? [
        // {
        // Here you can add cloud only feature flags
        // },
      ]
    : []),
];
