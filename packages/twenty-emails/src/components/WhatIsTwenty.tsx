import { type I18n } from '@lingui/core';
import { MainText } from 'src/components/MainText';
import { SubTitle } from 'src/components/SubTitle';

type WhatIsTwentyProps = {
  i18n: I18n;
};

export const WhatIsTwenty = ({ i18n }: WhatIsTwentyProps) => {
  return (
    <>
      <SubTitle value={i18n._('What is Nebula?')} />
      <MainText>
        {i18n._(
          "It's where your team and its AI agents work together, with one shared place for contacts, companies and deals.",
        )}
      </MainText>
    </>
  );
};
