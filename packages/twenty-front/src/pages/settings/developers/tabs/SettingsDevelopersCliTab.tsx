import { TWENTY_CLI_CREATE_APP_COMMANDS } from '@/settings/developers/constants/TwentyCliCreateAppCommands';
import { TWENTY_CLI_LOGIN_COMMAND } from '@/settings/developers/constants/TwentyCliLoginCommand';
import { useLingui } from '@lingui/react/macro';
import { type ReactNode } from 'react';
import { doNotTranslate } from 'twenty-shared/i18n';
import { CommandBlock } from 'twenty-ui/components/data-display';
import { Section } from 'twenty-ui/components/layout';
import { IconCopy } from 'twenty-ui/icon';
import { Button } from 'twenty-ui/primitives/input';
import { useCopyToClipboard } from '~/hooks/useCopyToClipboard';

type SettingsDevelopersCliCommandSectionProps = {
  title: string;
  description: string;
  commands: string[];
  children?: ReactNode;
};

const SettingsDevelopersCliCommandSection = ({
  title,
  description,
  commands,
  children,
}: SettingsDevelopersCliCommandSectionProps) => {
  const { t } = useLingui();
  const { copyToClipboard } = useCopyToClipboard();

  return (
    <Section.Root>
      <Section.Header title={title} description={description} />
      <CommandBlock
        commands={commands}
        actions={
          <Button
            onClick={() =>
              copyToClipboard(
                commands.join('\n'),
                t`Commands copied to clipboard`,
              )
            }
            aria-label={t`Copy commands`}
            startIcon={<IconCopy />}
          />
        }
      />
      {children}
    </Section.Root>
  );
};

export const SettingsDevelopersCliTab = () => {
  const { t } = useLingui();

  return (
    <>
      <SettingsDevelopersCliCommandSection
        title={t`Connect to this workspace`}
        description={t`Sign in from your browser and make this workspace your default connection. Requires Node.js 24.5 or later.`}
        commands={doNotTranslate([
          TWENTY_CLI_LOGIN_COMMAND,
          'npx twenty@latest auth status',
        ])}
      />

      <SettingsDevelopersCliCommandSection
        title={t`Explore your data`}
        description={t`Inspect the data model, query records and send raw API requests.`}
        commands={doNotTranslate([
          'npx twenty@latest metadata object list',
          'npx twenty@latest data list companies --limit 5',
          "npx twenty@latest api rest '/rest/people?limit=5'",
        ])}
      />

      <SettingsDevelopersCliCommandSection
        title={t`Build an app`}
        description={t`Scaffold an app, register it in this workspace and sync your changes as you code.`}
        commands={TWENTY_CLI_CREATE_APP_COMMANDS}
      />
    </>
  );
};
