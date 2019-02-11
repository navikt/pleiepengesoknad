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
            <Ingress>
                Lorem ipsum dolor sit amet, rationibus interpretaris eu nam, duo ad legere essent eirmod, mel in tota
                mediocritatem. Has dico falli in, nec esse vide ut.
            </Ingress>
        </Box>

        <div className={bem.element('centeredContent')}>
            <Box margin="xxl">
                <Knapp>Gå til dine saker</Knapp>
            </Box>
        </div>
    </Page>
);

export default ConfirmationPage;
