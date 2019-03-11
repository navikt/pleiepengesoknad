import * as React from 'react';
import Page from '../../page/Page';
import { Ingress, Innholdstittel } from 'nav-frontend-typografi';
import { SøkerdataContextConsumer } from '../../../context/SøkerdataContext';
import { Søkerdata } from '../../../types/Søkerdata';
import Box from '../../box/Box';
import bemUtils from '../../../utils/bemUtils';
const checkmarkIcon = require('./../../../../assets/checkmark.svg').default;
import CustomSVG from '../../custom-svg/CustomSVG';
import { Knapp } from 'nav-frontend-knapper';
import './confirmationPage.less';

const bem = bemUtils('confirmationPage');
const ConfirmationPage: React.FunctionComponent = () => (
    <Page title="Takk for søknaden!" className={bem.className}>
        <div className={bem.element('centeredContent')}>
            <CustomSVG iconRef={checkmarkIcon} size={48} />
            <Box margin="xl">
                <SøkerdataContextConsumer>
                    {(søkerdata: Søkerdata) => (
                        <Innholdstittel>Takk for søknaden, {søkerdata!.person.fornavn}!</Innholdstittel>
                    )}
                </SøkerdataContextConsumer>
            </Box>
        </div>

        <Box margin="xl">
            <Ingress>Husk at du må informere arbeidsgiveren din om at du søker om pleiepenger.</Ingress>
            <Box margin="l">
                <Ingress>
                    Når søknaden er ferdig behandlet, får du et brev fra oss. Se forventet saksbehandlingstid.
                </Ingress>
            </Box>
            <Box margin="l">
                <Ingress>
                    Har du spørsmål? Du er velkommen til å ringe 55 55 33 33. Da får du hjelp av veiledere med
                    spesialkunnskap om pleiepenger.
                </Ingress>
            </Box>
        </Box>

        <div className={bem.element('centeredContent')}>
            <Box margin="xxxl">
                <Knapp>Gå til dine saker</Knapp>
            </Box>
        </div>
    </Page>
);

export default ConfirmationPage;
