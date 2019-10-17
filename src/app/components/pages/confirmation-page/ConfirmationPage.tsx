import * as React from 'react';
import Page from '../../page/Page';
import { Ingress, Innholdstittel } from 'nav-frontend-typografi';
import Box from '../../box/Box';
import bemUtils from '../../../utils/bemUtils';
import Lenke from 'nav-frontend-lenker';
import CheckmarkIcon from '../../checkmark-icon/CheckmarkIcon';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import intlHelper from 'app/utils/intlUtils';
import getLenker from 'app/lenker';
import './confirmationPage.less';
import { appIsRunningInDemoMode } from '../../../utils/envUtils';
import AlertStripe from 'nav-frontend-alertstriper';

type Props = InjectedIntlProps;

const bem = bemUtils('confirmationPage');

const ConfirmationPage: React.FunctionComponent<Props> = ({ intl }) => (
    <Page title={intlHelper(intl, 'page.confirmation.sidetittel')} className={bem.block}>
        <div className={bem.element('centeredContent')}>
            <CheckmarkIcon />
            <Box margin="xl">
                <Innholdstittel>
                    <FormattedMessage id="page.confirmation.tittel" />
                </Innholdstittel>
            </Box>
        </div>
        <Box margin="xl">
            <Ingress>
                <FormattedMessage id="page.confirmation.part1" />
            </Ingress>
            <Box margin="l">
                <Ingress>
                    <FormattedMessage id="page.confirmation.part2" />{' '}
                    <Lenke href={getLenker(intl.locale).saksbehandlingstider} target="_blank">
                        <FormattedMessage id="page.confirmation.saksbehandlingstid" />
                    </Lenke>
                    .
                </Ingress>
            </Box>
        </Box>
        {appIsRunningInDemoMode() && (
            <Box margin="xxl">
                <AlertStripe type="info">
                    <h2>Takk for at du testet søknaden</h2>
                    <p>
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <h4>Vil du hjelpe oss mer ved å svare på noen spørsmål?</h4>
                    <a href="https://surveys.hotjar.com/s?siteId=148751&surveyId=144079">
                        Ja, ta meg til tilbakemeldingsskjema
                    </a>
                </AlertStripe>
            </Box>
        )}
    </Page>
);

export default injectIntl(ConfirmationPage);
