import { type I18n } from '@lingui/core';
import { Container } from 'react-email';
import { Link } from 'src/components/Link';
import { ShadowText } from 'src/components/ShadowText';

const footerContainerStyle = {
  marginTop: '12px',
};

// AGPL-3.0 section 13: the modified CRM's source is offered to its users
const PRISM_SOURCE_URL = 'https://github.com/msg-builds/Prism';

type FooterProps = {
  i18n: I18n;
};

export const Footer = ({ i18n }: FooterProps) => {
  return (
    <Container style={footerContainerStyle}>
      <ShadowText>
        <>
          {i18n._('Nebula CRM is built on Twenty, open source under AGPL-3.0.')}{' '}
          <Link href={PRISM_SOURCE_URL} value={i18n._('Source')} />
        </>
      </ShadowText>
    </Container>
  );
};
