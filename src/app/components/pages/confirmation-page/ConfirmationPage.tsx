import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { Knapp } from 'nav-frontend-knapper';
import Lenke from 'nav-frontend-lenker';
import Panel from 'nav-frontend-paneler';
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

const ConfirmationPage = ({ kvitteringInfo }: Props) => {
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
                                <FormattedMessage id="page.confirmation.søker" values={{ numberOfArbeidsforhold }} />
                            </li>
                        )}
                        <li>
                            <FormattedMessage id="page.confirmation.behandling" />
                        </li>
                        <li>
                            <FormattedMessage
                                id="page.confirmation.behandlet.html"
                                values={{
                                    lenke: getLenker(intl.locale).saksbehandlingstider,
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
                                <strong>Obs!</strong> Denne informasjonssiden forsvinner når du lukker den. Det er
                                derfor viktig at du leser gjennom før du går videre.
                                <p>
                                    Siden kan printes ut, slik at du kan gi utskrift til{' '}
                                    {pluralize(numberOfArbeidsforhold, 'arbeidsgiveren din', 'arbeidsgiverne dine')}.
                                </p>
                            </AlertStripeInfo>
                        </Box>
                    )}
                    <Box margin="xl">
                        <Panel className={bem.element('steps')} border={true}>
                            <Ingress>
                                <FormattedMessage id="page.confirmation.undertittel" />
                            </Ingress>
                            <ul className="checklist">
                                <li>
                                    Dette er en bekreftelse på at vi har mottatt søknaden din. På grunn av stor pågang
                                    er det vanskelig å si når søknaden blir synlig for deg på Ditt NAV.
                                    <p>
                                        Når søknaden din er ferdigbehandlet, får du et svar fra oss. Se{' '}
                                        <Lenke href={getLenker(intl.locale).saksbehandlingstider} target="_blank">
                                            saksbehandlingstiden som gjelder for ditt fylke
                                        </Lenke>{' '}
                                        .
                                    </p>
                                </li>
                                {numberOfArbeidsforhold > 0 && (
                                    <>
                                        <li>
                                            Du må be arbeidsgiver om å sende inntektsmelding til oss. Det er viktig at
                                            arbeidsgiver krysser av for at inntektsmeldingen gjelder{' '}
                                            <strong>pleiepenger</strong>.
                                            <p>Vi kontakter deg hvis vi trenger flere opplysninger i saken din.</p>
                                        </li>
                                        <li>
                                            Du kan skrive ut denne informasjonssiden og gi utskriften til{' '}
                                            {pluralize(
                                                numberOfArbeidsforhold,
                                                'arbeidsgiver din',
                                                'arbeidsgiverne dine'
                                            )}
                                            .
                                        </li>
                                    </>
                                )}
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
                                            Hvis du ikke kan skrive ut denne informasjonssiden, kan du ta bilde av den.
                                            Husk også å ta bilde av informasjonen som kommer under, som du kan gi til
                                            arbeidsgiver.
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
