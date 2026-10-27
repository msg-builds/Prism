import { type I18n } from '@lingui/core';
import { Text } from 'react-email';

import { canvasTheme } from 'src/common-style';

// Text, not an image: the private deployment has no public host for assets
const logoStyle = {
  margin: '0 0 40px 0',
  fontFamily: "'Iowan Old Style', Georgia, serif",
  fontSize: '24px',
  lineHeight: '28px',
  letterSpacing: '0.02em',
  color: canvasTheme.font.colors.brand,
};

type LogoProps = {
  i18n: I18n;
};

export const Logo = ({ i18n }: LogoProps) => {
  return (
    <Text style={logoStyle} aria-label={i18n._('Nebula logo')}>
      Nebula
    </Text>
  );
};
