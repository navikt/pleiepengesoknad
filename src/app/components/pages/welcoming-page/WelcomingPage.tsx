import * as React from 'react';
import { injectIntl } from 'react-intl';
import { Normaltekst, Innholdstittel } from 'nav-frontend-typografi';
import { Hovedknapp } from 'nav-frontend-knapper';
import Page from '../../../components/page/Page';
import bemHelper from '../../../utils/bemHelper';
import './welcomingPage.less';
import Box from '../../../components/box/Box';
import intlHelper from '../../../utils/intlHelper';
import ConfirmationCheckboxPanel from '../../confirmation-checkbox-panel/ConfirmationCheckboxPanel';
import InjectedIntlProps = ReactIntl.InjectedIntlProps;
import { HistoryProps } from '../../../types/History';

const bem = bemHelper('welcomingPage');

interface WelcomingPageProps {
    isValid: boolean;
    onSubmit: () => Promise<void>;
}

const WelcomingPage: React.FunctionComponent<WelcomingPageProps & InjectedIntlProps & HistoryProps> = ({
    isValid,
    onSubmit,
    intl,
    history
}) => (
    <Page title="Velkommen til søknad om pleiepenger" className={bem.className}>
        <Innholdstittel className={bem.element('title')}>{intlHelper(intl, 'introtittel')}</Innholdstittel>

        <Box margin="m">
            <Normaltekst>{intlHelper(intl, 'introtekst')}</Normaltekst>
        </Box>

        <Box margin="l">
            <ConfirmationCheckboxPanel label={intlHelper(intl, 'jajegsamtykker')} name="harGodkjentVilkår">
                {intlHelper(intl, 'forståttrettigheterogplikter')}
            </ConfirmationCheckboxPanel>
        </Box>

        <Box margin="l">
            <Hovedknapp
                className={bem.element('startApplicationButton')}
                onClick={() => history.push('soknad/relasjon-til-barn')}>
                {intlHelper(intl, 'begynnsøknad')}
            </Hovedknapp>
        </Box>
    </Page>
);

export default injectIntl(WelcomingPage);
