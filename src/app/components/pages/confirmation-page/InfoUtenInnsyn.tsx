import Lenke from 'nav-frontend-lenker';
import { Ingress } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import getLenker from '../../../lenker';
import { pluralize } from './ConfirmationPage';

interface Props {
    numberOfArbeidsforhold: number;
}

const InfoUtenInnsyn = ({ numberOfArbeidsforhold }: Props) => {
    const intl = useIntl();
    return (
        <>
            <Ingress>
                <FormattedMessage id="page.confirmation.undertittel" />
            </Ingress>
            <ul className="checklist">
                <li>
                    Dette er en bekreftelse på at vi har mottatt søknaden din. På grunn av stor pågang er det vanskelig
                    å si når søknaden blir synlig for deg på Ditt NAV.
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
                            Du må be arbeidsgiver om å sende inntektsmelding til oss. Det er viktig at arbeidsgiver
                            krysser av for at inntektsmeldingen gjelder <strong>pleiepenger</strong>.
                            <p>Vi kontakter deg hvis vi trenger flere opplysninger i saken din.</p>
                        </li>
                        <li>
                            Du kan skrive ut denne informasjonssiden og gi utskriften til{' '}
                            {pluralize(numberOfArbeidsforhold, 'arbeidsgiver din', 'arbeidsgiverne dine')}.
                        </li>
                    </>
                )}
            </ul>
        </>
    );
};

export default InfoUtenInnsyn;
