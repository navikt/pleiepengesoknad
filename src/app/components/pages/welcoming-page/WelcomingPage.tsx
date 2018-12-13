import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { BekreftCheckboksPanel } from 'nav-frontend-skjema';
import { Normaltekst, Innholdstittel } from 'nav-frontend-typografi';
import { Hovedknapp } from 'nav-frontend-knapper';
import Page from '../../../components/page/Page';
import bemHelper from '../../../utils/bemHelper';
import './welcomingPage.less';
import Box from '../../../components/box/Box';
import intlHelper from '../../../utils/intlHelper';
import { HistoryProps } from '../../../types/History';

const bem = bemHelper('welcomingPage');

export interface WelcomingPageStateProps {
    harGodkjentVilkår: boolean;
}

export interface WelcomingPageFunctionProps {
    updateHarGodkjentVilkår: (value: boolean) => void;
}

type Props = WelcomingPageStateProps & WelcomingPageFunctionProps & InjectedIntlProps & HistoryProps;

const WelcomingPage: React.FunctionComponent<Props> = ({
    harGodkjentVilkår,
    updateHarGodkjentVilkår,
    intl,
    history
}) => (
    <Page title="Velkommen til søknad om pleiepenger" className={bem.className}>
        <Innholdstittel className={bem.element('title')}>{intlHelper(intl, 'introtittel')}</Innholdstittel>

        <Box margin="m">
            <Normaltekst>{intlHelper(intl, 'introtekst')}</Normaltekst>
        </Box>

        <Box margin="l">
            <BekreftCheckboksPanel
                onChange={() => {
                    updateHarGodkjentVilkår(!harGodkjentVilkår);
                }}
                checked={harGodkjentVilkår === true}
                label={intlHelper(intl, 'jajegsamtykker')}>
                {intlHelper(intl, 'forståttrettigheterogplikter')}
            </BekreftCheckboksPanel>
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
