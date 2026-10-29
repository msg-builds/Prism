import { currentUserState } from '@/auth/states/currentUserState';
import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { currentWorkspaceMembersState } from '@/auth/states/currentWorkspaceMembersState';
import { getToastOptionsFromError } from '@/error-handler/utils/getToastOptionsFromError';
import { OnboardingRewardMainButton } from '@/onboarding/components/OnboardingRewardMainButton';
import { OnboardingStepAnimatedItem } from '@/onboarding/components/OnboardingStepAnimatedItem';
import { StyledOnboardingStepHeading } from '@/onboarding/components/StyledOnboardingStepHeading';
import { StyledOnboardingStepPage } from '@/onboarding/components/StyledOnboardingStepPage';
import { StyledOnboardingStepSubtitle } from '@/onboarding/components/StyledOnboardingStepSubtitle';
import { StyledOnboardingStepTitle } from '@/onboarding/components/StyledOnboardingStepTitle';
import { ONBOARDING_CONTENT_BLOCK_WIDTH } from '@/onboarding/constants/OnboardingContentBlockWidth';
import { usePrefetchInviteSuggestions } from '@/onboarding/hooks/usePrefetchInviteSuggestions';
import { useSetNextOnboardingStatus } from '@/onboarding/hooks/useSetNextOnboardingStatus';
import { useSetOnboardingStepFreeCredits } from '@/onboarding/hooks/useSetOnboardingStepFreeCredits';
import { onboardingCreateProfileDraftState } from '@/onboarding/states/onboardingCreateProfileDraftState';
import { onboardingCreditsProgressSelector } from '@/onboarding/states/selectors/onboardingCreditsProgressSelector';
import { useUpdateWorkspaceMemberSettings } from '@/workspace-member/hooks/useUpdateWorkspaceMemberSettings';
import { PageFocusId } from '@/types/PageFocusId';
import { TextInput } from '@/ui/input/components/TextInput';
import { useHotkeysOnFocusedElement } from '@/ui/utilities/hotkey/hooks/useHotkeysOnFocusedElement';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useSetAtomState } from '@/ui/utilities/state/jotai/hooks/useSetAtomState';
import { zodResolver } from '@hookform/resolvers/zod';
import { styled } from '@linaria/react';
import { i18n } from '@lingui/core';
import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';
import { useStore } from 'jotai';
import { useCallback, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { Key } from 'ts-key-enum';
import { isDefined } from 'twenty-shared/utils';
import { doNotTranslate } from 'twenty-shared/i18n';
import { useToast } from 'twenty-ui/components/feedback';
import { themeCssVariables } from 'twenty-ui/theme';
import { z } from 'zod';

const StyledForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[8]};
  max-width: 100%;
  padding-bottom: ${themeCssVariables.spacing[4]};
  width: ${ONBOARDING_CONTENT_BLOCK_WIDTH}px;
`;

const StyledButtonContainer = styled.div`
  display: flex;
  max-width: 100%;
  width: ${ONBOARDING_CONTENT_BLOCK_WIDTH}px;
`;

const firstNameErrorMessage = msg`First name can not be empty`;

const validationSchema = z.object({
  firstName: z.string().min(1, {
    error: i18n._(firstNameErrorMessage),
  }),
  jobTitle: z.string(),
});

type Form = z.infer<typeof validationSchema>;

export const CreateProfile = () => {
  const { t } = useLingui();
  const setNextOnboardingStatus = useSetNextOnboardingStatus();
  const setOnboardingStepFreeCredits = useSetOnboardingStepFreeCredits();

  usePrefetchInviteSuggestions();

  const { enqueueToast } = useToast();
  const currentWorkspaceMember = useAtomStateValue(currentWorkspaceMemberState);
  const store = useStore();
  const onboardingCreditsProgress = useAtomStateValue(
    onboardingCreditsProgressSelector,
  );
  const setOnboardingCreateProfileDraft = useSetAtomState(
    onboardingCreateProfileDraftState,
  );
  const [initialCreateProfileDraft] = useState(() =>
    store.get(onboardingCreateProfileDraftState.atom),
  );
  const setCurrentUser = useSetAtomState(currentUserState);
  const setCurrentWorkspaceMembers = useSetAtomState(
    currentWorkspaceMembersState,
  );
  const { updateWorkspaceMemberSettings } = useUpdateWorkspaceMemberSettings();

  const [isNavigating, setIsNavigating] = useState(false);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { isValid, isSubmitting },
  } = useForm<Form>({
    mode: 'onChange',
    defaultValues: {
      firstName:
        initialCreateProfileDraft?.firstName ??
        currentWorkspaceMember?.name?.firstName ??
        '',
      jobTitle: currentWorkspaceMember?.jobTitle ?? '',
    },
    resolver: zodResolver(validationSchema),
  });

  // Prism asks for a first name only; a last name already on the member is kept, never cleared
  const lastName = currentWorkspaceMember?.name?.lastName ?? '';

  const setCreateProfileDraftFromForm = () =>
    setOnboardingCreateProfileDraft({
      firstName: getValues('firstName'),
      lastName,
    });

  const onSubmit: SubmitHandler<Form> = useCallback(
    async (data) => {
      try {
        if (!currentWorkspaceMember?.id) {
          throw new Error(doNotTranslate('User is not logged in'));
        }
        if (!data.firstName) {
          throw new Error(doNotTranslate('First name is missing'));
        }

        await updateWorkspaceMemberSettings({
          workspaceMemberId: currentWorkspaceMember.id,
          update: {
            name: {
              firstName: data.firstName,
              lastName,
            },
            jobTitle: data.jobTitle,
            colorScheme: doNotTranslate('System'),
          },
        });

        setCurrentWorkspaceMembers((members) =>
          members.map((member) =>
            member.id === currentWorkspaceMember?.id
              ? {
                  ...member,
                  name: {
                    firstName: data.firstName,
                    lastName,
                  },
                  jobTitle: data.jobTitle,
                  colorScheme: doNotTranslate('System'),
                }
              : member,
          ),
        );

        setCurrentUser((current) => {
          if (isDefined(current)) {
            return {
              ...current,
              firstName: data.firstName,
              lastName,
            };
          }
          return current;
        });

        setOnboardingStepFreeCredits(
          'createProfile',
          store.get(onboardingCreditsProgressSelector.atom).rewardCreditsByStep
            .createProfile,
        );
        setNextOnboardingStatus({ stepHistoryEffect: 'recordAsReversible' });
        setIsNavigating(true);
      } catch (error: any) {
        setIsNavigating(false);
        enqueueToast(getToastOptionsFromError({ error }));
      }
    },
    [
      currentWorkspaceMember?.id,
      lastName,
      store,
      setNextOnboardingStatus,
      setOnboardingStepFreeCredits,
      enqueueToast,
      setCurrentWorkspaceMembers,
      setCurrentUser,
      updateWorkspaceMemberSettings,
    ],
  );

  const [isEditingMode, setIsEditingMode] = useState(false);

  const handleEnter = () => {
    if (isEditingMode) {
      handleSubmit(onSubmit)();
    }
  };

  useHotkeysOnFocusedElement({
    keys: Key.Enter,
    callback: handleEnter,
    focusId: PageFocusId.CreateProfile,
    dependencies: [handleEnter],
  });

  return (
    <StyledOnboardingStepPage data-testid="onboarding-create-profile-step">
      <StyledOnboardingStepHeading>
        <OnboardingStepAnimatedItem index={0}>
          <StyledOnboardingStepTitle>{t`Create profile`}</StyledOnboardingStepTitle>
        </OnboardingStepAnimatedItem>
        <OnboardingStepAnimatedItem index={1}>
          <StyledOnboardingStepSubtitle>
            {t`How you'll appear to teammates and agents.`}
          </StyledOnboardingStepSubtitle>
        </OnboardingStepAnimatedItem>
      </StyledOnboardingStepHeading>

      <OnboardingStepAnimatedItem index={2}>
        <StyledForm>
          <Controller
            name="firstName"
            control={control}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <TextInput
                autoFocus
                label={t`First Name`}
                value={value}
                onFocus={() => setIsEditingMode(true)}
                onBlur={() => {
                  onBlur();
                  setIsEditingMode(false);
                }}
                onChange={(firstName) => {
                  onChange(firstName);
                  setCreateProfileDraftFromForm();
                }}
                placeholder={t`Tim`}
                error={error?.message}
                fullWidth
              />
            )}
          />
          <Controller
            name="jobTitle"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label={t`Job Title`}
                value={value}
                onFocus={() => setIsEditingMode(true)}
                onBlur={() => {
                  onBlur();
                  setIsEditingMode(false);
                }}
                onChange={onChange}
                placeholder={t`Head of Partnerships`}
                fullWidth
              />
            )}
          />
        </StyledForm>
      </OnboardingStepAnimatedItem>

      <OnboardingStepAnimatedItem index={3}>
        <StyledButtonContainer>
          <OnboardingRewardMainButton
            label={t`Continue`}
            creditsReward={
              onboardingCreditsProgress.rewardCreditsByStep.createProfile
            }
            disabled={!isValid || isSubmitting || isNavigating}
            onClick={handleSubmit(onSubmit)}
          />
        </StyledButtonContainer>
      </OnboardingStepAnimatedItem>
    </StyledOnboardingStepPage>
  );
};
