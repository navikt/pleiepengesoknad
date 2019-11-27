import * as React from 'react';
import Page from '../../page/Page';
import { Ingress, Innholdstittel } from 'nav-frontend-typografi';
import Box from '../../box/Box';
import bemUtils from '../../../utils/bemUtils';
import CheckmarkIcon from '../../checkmark-icon/CheckmarkIcon';
import { FormattedMessage, injectIntl, InjectedIntlProps, FormattedHTMLMessage } from 'react-intl';
import intlHelper from 'app/utils/intlUtils';
import getLenker from 'app/lenker';
import './confirmationPage.less';
import { appIsRunningInDemoMode } from '../../../utils/envUtils';
import AlertStripe from 'nav-frontend-alertstriper';

type Props = InjectedIntlProps & { numberOfAnsettelsesforhold: number };

const bem = bemUtils('confirmationPage');

const ConfirmationPage: React.FunctionComponent<Props> = ({ intl, numberOfAnsettelsesforhold }) => (
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
                <FormattedMessage id="page.confirmation.undertittel" />
            </Ingress>
            <ul className="checklist">
                {numberOfAnsettelsesforhold > 0 && (
                    <li>
                        <FormattedHTMLMessage id="page.confirmation.søker" values={{ numberOfAnsettelsesforhold }} />
                    </li>
                )}
                <li>
                    <FormattedHTMLMessage
                        id="page.confirmation.nav.html"
                        values={{
                            lenke: getLenker(intl.locale).saksbehandlingstider
                        }}
                    />
                </li>
            </ul>
        </Box>
        {appIsRunningInDemoMode() && (
            <Box margin="xxl">
                <AlertStripe type="info">
                    <p>
                        Hvis du har flere innspill til oss om hvordan vi kan gjøre søknaden bedre, kan du skrive til oss{' '}
                        <a href="https://surveys.hotjar.com/s?siteId=148751&surveyId=144184">på denne siden</a>.
                    </p>
                    <p>Tusen takk for hjelpen!</p>
                </AlertStripe>
            </Box>
        )}
    </Page>
);

export default injectIntl(ConfirmationPage);
