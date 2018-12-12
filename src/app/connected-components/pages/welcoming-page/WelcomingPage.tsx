import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { BekreftCheckboksPanel } from 'nav-frontend-skjema';
import { Normaltekst, Innholdstittel } from 'nav-frontend-typografi';
import { Hovedknapp } from 'nav-frontend-knapper';
import Page from '../../../components/page/Page';
import bemHelper from '../../../utils/bemHelper';
import './welcomingPage.less';
import Box from '../../../components/box/Box';

const bem = bemHelper('welcomingPage');

class WelcomingPage extends React.Component<InjectedIntlProps> {
    render() {
        const { intl } = this.props;
        return (
            <Page title="Velkommen til søknad om pleiepenger" className={bem.className}>
                <Innholdstittel className={bem.element('title')}>
                    {intl.formatMessage({ id: 'introtittel' })}
                </Innholdstittel>
                <Box margin="m">
                    <Normaltekst>{intl.formatMessage({ id: 'introtekst' })}</Normaltekst>
                </Box>
                <Box margin="l">
                    <BekreftCheckboksPanel
                        onChange={() => {}}
                        checked={false}
                        label={intl.formatMessage({ id: 'jajegsamtykker' })}>
                        {intl.formatMessage({ id: 'forståttrettigheterogplikter' })}
                    </BekreftCheckboksPanel>
                </Box>
                <Box margin="l">
                    <Hovedknapp className={bem.element('startApplicationButton')}>
                        {intl.formatMessage({ id: 'begynnsøknad' })}
                    </Hovedknapp>
                </Box>
            </Page>
        );
    }
}

export default injectIntl(WelcomingPage);
