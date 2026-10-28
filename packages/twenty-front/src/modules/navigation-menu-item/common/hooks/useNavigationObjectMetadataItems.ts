import { CoreObjectNameSingular } from 'twenty-shared/types';

import { useFeatureHiddenObjectNameSingulars } from '@/object-metadata/hooks/useFeatureHiddenObjectNameSingulars';
import { objectMetadataItemsSelector } from '@/object-metadata/states/objectMetadataItemsSelector';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';

export const useNavigationObjectMetadataItems = () => {
  const objectMetadataItems = useAtomStateValue(objectMetadataItemsSelector);
  const featureHiddenObjectNameSingulars =
    useFeatureHiddenObjectNameSingulars();

  return objectMetadataItems.filter(
    (objectMetadataItem) =>
      objectMetadataItem.nameSingular !==
        CoreObjectNameSingular.WorkflowVersion &&
      !featureHiddenObjectNameSingulars.includes(
        objectMetadataItem.nameSingular,
      ),
  );
};
