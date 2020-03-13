import * as React from 'react';
import { FormattedHTMLMessage, FormattedMessage, useIntl } from 'react-intl';
import AlertStripe, { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { Knapp } from 'nav-frontend-knapper';
import { Element, Ingress, Innholdstittel } from 'nav-frontend-typografi';
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

export const pluralize = (count: number, single: string, other: string) => (count === 1 ? single : other);

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
                <AlertStripeInfo>
                    Informasjonen på denne siden vises kun denne éne gangen, og da er det viktig viktig at du får med
                    deg alt under, før du går videre.
                </AlertStripeInfo>
            </Box>
            <Box margin="xl">
                <Ingress>
                    <FormattedMessage id="page.confirmation.undertittel" />
                </Ingress>
                <ul className="checklist">
                    {numberOfArbeidsforhold > 0 && (
                        <li>
                            <p>
                                Du må be{' '}
                                {pluralize(numberOfArbeidsforhold, 'arbeidsgiveren din', 'arbeidsgiverene dine')} om å
                                sende inntektsmelding til oss. Dette kan du gjøre ved å skrive ut denne siden, og gi
                                utskriften til arbeidsgiver. Knapp for å skrive ut finner du nedenfor.
                                {numberOfArbeidsforhold > 1 && (
                                    <>Uskriften vil innholde en side for hver av arbeidsgiverene dine.</>
                                )}
                            </p>
                            <p>
                                Dersom du ikke har printer, kan du ta skjermbilder av denne siden i stedet. Husk å ta
                                bilder av alt som står nedenfor!
                            </p>
                            {/* <FormattedHTMLMessage id="page.confirmation.søker" values={{ numberOfArbeidsforhold }} /> */}
                        </li>
                    )}
                    <li>
                        <FormattedMessage id="page.confirmation.dittNav" />
                    </li>
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
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <Knapp htmlType="button" onClick={() => window.print()} type="hoved">
                            Skriv ut denne siden nå
                        </Knapp>
                    </div>
                    <Element tag="p">
                        {pluralize(
                            numberOfArbeidsforhold,
                            `Side som du skal gi til ${kvitteringInfo.arbeidsforhold[0].navn}:`,
                            'Sider som du skal gi til de respektive arbeidsgivere:'
                        )}
                        .
                    </Element>

                    {kvitteringInfo?.arbeidsforhold.map((a, idx) => (
                        <Box margin="xxl" key={idx}>
                            <NavPrintPage>
                                <ArbeidsgiverUtskrift
                                    arbeidsgiver={a.navn}
                                    fom={kvitteringInfo.fom}
                                    tom={kvitteringInfo.tom}
                                    søkernavn={kvitteringInfo.søkernavn}
                                />
                            </NavPrintPage>
                        </Box>
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
