import { AiChatInlineBanner } from '@/ai/components/AiChatInlineBanner';
import { t } from '@lingui/core/macro';

export const AiChatApiKeyNotConfiguredMessage = () => (
  <AiChatInlineBanner>{t`Add an API key to enable AI.`}</AiChatInlineBanner>
);
