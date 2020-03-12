import * as React from 'react';
import { FormattedHTMLMessage, FormattedMessage, useIntl } from 'react-intl';
import AlertStripe from 'nav-frontend-alertstriper';
import { Knapp } from 'nav-frontend-knapper';
import { Ingress, Innholdstittel } from 'nav-frontend-typografi';
import Box from 'common/components/box/Box';
import CheckmarkIcon from 'common/components/checkmark-icon/CheckmarkIcon';
import Page from 'common/components/page/Page';
import bemUtils from 'common/utils/bemUtils';
import intlHelper from 'common/utils/intlUtils';
import getLenker from 'app/lenker';
import { appIsRunningInDemoMode } from '../../../utils/envUtils';
import NavPrintPage from '../../nav-print-page/NavPrintPage';
import { KvitteringInfo } from '../../pleiepengesøknad-content/PleiepengesøknadContent';
import ArbeidsgiverUtskrift from './ArbeidsgiverUtskrift';
import './confirmationPage.less';

interface Props {
    kvitteringInfo?: KvitteringInfo;
}

const bem = bemUtils('confirmationPage');

const ConfirmationPage: React.FunctionComponent<Props> = ({ kvitteringInfo }) => {
    const intl = useIntl();
    const numberOfArbeidsforhold = kvitteringInfo ? kvitteringInfo.arbeidsforhold.length : 0;

    return (
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
                    <li>
                        <FormattedMessage id="page.confirmation.dittNav" />
                    </li>
                    {numberOfArbeidsforhold > 0 && (
                        <li>
                            <FormattedHTMLMessage id="page.confirmation.søker" values={{ numberOfArbeidsforhold }} />
                        </li>
                    )}
                    <li>
                        <FormattedMessage id="page.confirmation.behandling" />
                    </li>
                    <li>
                        <FormattedHTMLMessage
                            id="page.confirmation.behandlet.html"
                            values={{
                                lenke: getLenker(intl.locale).saksbehandlingstider
                            }}
                        />
                    </li>
                </ul>
            </Box>
            {kvitteringInfo?.arbeidsforhold && (
                <Box margin="xxl">
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <Knapp htmlType="button" onClick={() => window.print()} type="hoved">
                            Skriv ut denne siden nå
                        </Knapp>
                    </div>
                    {kvitteringInfo?.arbeidsforhold.map((a, idx) => (
                        <NavPrintPage key={idx}>
                            <ArbeidsgiverUtskrift
                                arbeidsgiver={a.navn}
                                fom={kvitteringInfo.fom}
                                tom={kvitteringInfo.tom}
                                søkernavn={kvitteringInfo.søkernavn}
                            />
                        </NavPrintPage>
                    ))}
                </Box>
            )}

            {appIsRunningInDemoMode() && (
                <Box margin="xxl">
                    <AlertStripe type="info">
                        <p>
                            Hvis du har flere innspill til oss om hvordan vi kan gjøre søknaden bedre, kan du skrive til
                            oss <a href="https://surveys.hotjar.com/s?siteId=148751&surveyId=144184">på denne siden</a>.
                        </p>
                        <p>Tusen takk for hjelpen!</p>
                    </AlertStripe>
                </Box>
            )}
        </Page>
    );
};

export default ConfirmationPage;
