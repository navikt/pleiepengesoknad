import * as React from 'react';
import Page from '../../page/Page';
import { Ingress, Innholdstittel } from 'nav-frontend-typografi';
import Box from '../../box/Box';
import bemUtils from '../../../utils/bemUtils';
import Lenke from 'nav-frontend-lenker';
import CheckmarkIcon from '../../checkmark-icon/CheckmarkIcon';
import './confirmationPage.less';

const bem = bemUtils('confirmationPage');
const ConfirmationPage: React.FunctionComponent = () => (
    <Page title="Takk for søknaden" className={bem.className}>
        <div className={bem.element('centeredContent')}>
            <CheckmarkIcon />
            <Box margin="xl">
                <Innholdstittel>Takk for søknaden</Innholdstittel>
            </Box>
        </div>

        <Box margin="xl">
            <Ingress>Husk å informere arbeidsgiveren din om at du søker om pleiepenger.</Ingress>
            <Box margin="l">
                <Ingress>
                    Når søknaden er ferdig behandlet, får du et brev fra oss.{' '}
                    <Lenke
                        href="https://www.nav.no/no/NAV+og+samfunn/Om+NAV/Saksbehandlingstider+i+NAV"
                        target="_blank">
                        Se forventet saksbehandlingstid.
                    </Lenke>
                </Ingress>
            </Box>
            <Box margin="l">
                <Ingress>
                    Har du spørsmål? Du er velkommen til å ringe 55 55 33 33. Da får du hjelp av veiledere med
                    spesialkunnskap om pleiepenger.
                </Ingress>
            </Box>
        </Box>
    </Page>
);

export default ConfirmationPage;
