import * as React from 'react';
import { FormattedHTMLMessage, FormattedMessage, useIntl } from 'react-intl';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { Knapp } from 'nav-frontend-knapper';
import { Panel } from 'nav-frontend-paneler';
import { Ingress, Innholdstittel } from 'nav-frontend-typografi';
import Box from 'common/components/box/Box';
import CheckmarkIcon from 'common/components/checkmark-icon/CheckmarkIcon';
import Page from 'common/components/page/Page';
import bemUtils from 'common/utils/bemUtils';
import intlHelper from 'common/utils/intlUtils';
import getLenker from 'app/lenker';
import { Feature, isFeatureEnabled } from '../../../utils/featureToggleUtils';
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
            {isFeatureEnabled(Feature.UTVIDET_KVITTERING) === false && (
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
                                <FormattedHTMLMessage
                                    id="page.confirmation.søker"
                                    values={{ numberOfArbeidsforhold }}
                                />
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
            )}
            {isFeatureEnabled(Feature.UTVIDET_KVITTERING) && (
                <>
                    {numberOfArbeidsforhold > 0 && (
                        <Box margin="xl">
                            <AlertStripeInfo>
                                <strong>Obs!</strong> Denne siden forsvinner når du lukker den. Det er derfor viktig at
                                du leser gjennom siden før du går videre.
                                <p style={{ marginBottom: 0 }}>
                                    Siden kan skrives ut, og gis til{' '}
                                    {pluralize(numberOfArbeidsforhold, 'arbeidsgiveren din', 'arbeidsgiverene dine')}.
                                </p>
                            </AlertStripeInfo>
                        </Box>
                    )}
                    <Box margin="l">
                        <Panel className={bem.element('steps')} border={true}>
                            <Ingress>
                                <FormattedMessage id="page.confirmation.undertittel" />
                            </Ingress>
                            <ul className="checklist">
                                {numberOfArbeidsforhold > 0 && (
                                    <>
                                        <li>
                                            <div>
                                                Du må be{' '}
                                                {pluralize(numberOfArbeidsforhold, 'arbeidsgiver', 'arbeidsgiverene')}{' '}
                                                om å sende inntektsmelding til oss, hvis:
                                                <ul>
                                                    <li>du har sendt søknad for første gang, eller</li>
                                                    <li>
                                                        du skal søke på nytt etter et opphold. Et opphold vil si at det
                                                        er minst 4 uker siden du hadde pleiepenger sist.
                                                    </li>
                                                </ul>
                                            </div>
                                        </li>
                                        <li>
                                            {pluralize(numberOfArbeidsforhold, 'Arbeidsgiver', 'Arbeidsgiverene')}{' '}
                                            behøver <strong>ikke</strong> sende inntektsmelding på ny når du søker om å
                                            forlenge perioden din med pleiepenger.
                                        </li>
                                        <li>
                                            Du kan skrive ut denne informasjonssiden og gi utskriften til{' '}
                                            {pluralize(
                                                numberOfArbeidsforhold,
                                                'arbeidsgiveren din',
                                                'arbeidsgiverene dine'
                                            )}
                                            . Hvis du er registrert med flere arbeidsgivere, får du en utskrift til hver
                                            av dem.
                                        </li>
                                    </>
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

                            {kvitteringInfo?.arbeidsforhold && (
                                <Box margin="xxl">
                                    <div style={{ textAlign: 'center', marginBottom: '2rem' }} className={'screenOnly'}>
                                        <Knapp htmlType="button" onClick={() => window.print()} type="hoved">
                                            Skriv ut denne siden nå
                                        </Knapp>
                                    </div>
                                    <div style={{ margin: '0 auto', maxWidth: '50rem', marginBottom: '1rem' }}>
                                        <strong>
                                            Hvis du ikke vil eller kan skrive ut, kan du ta skjermbilder av denne siden.
                                            Husk også å ta bilde av informasjonen under, som du kan gi til arbeidsgiver.
                                        </strong>
                                    </div>
                                </Box>
                            )}
                        </Panel>
                    </Box>
                    {kvitteringInfo?.arbeidsforhold && (
                        <Box margin="xl">
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
                </>
            )}
        </Page>
    );
};

export default ConfirmationPage;
