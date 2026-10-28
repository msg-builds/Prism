// Initials only: the preview must not load images from upstream hosts
export const ONBOARDING_NETWORK_PREVIEW_PEOPLE = ['A', 'J', 'M', 'S', 'L'].map(
  (initial) => ({
    id: `network-preview-person-${initial}`,
    name: initial,
  }),
);
