import React from 'react';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import Lenke from 'nav-frontend-lenker';
import { Element, Systemtittel } from 'nav-frontend-typografi';
import './arbeidsgiverUtskrift.less';

interface Props {
    fom: Date;
    tom: Date;
    arbeidsgiver: string;
    søkernavn: string;
}

const bem = bemUtils('arbeidsgiverUtskrift');

const ArbeidsgiverUtskrift: React.FunctionComponent<Props> = ({ arbeidsgiver, søkernavn, fom, tom }) => (
    <div className={bem.block}>
        <Systemtittel style={{ marginBottom: '1rem' }}>Til {arbeidsgiver}</Systemtittel>
        <p>
            <Element tag="span">Vi har mottatt følgende opplysninger:</Element>
        </p>
        <p>
            {søkernavn} har et arbeidsforhold til {arbeidsgiver}
        </p>
        <p>
            {søkernavn} søker om Pleiepenger for perioden <strong>{prettifyDate(fom)}</strong> til{' '}
            <strong>{prettifyDate(tom)}</strong>
        </p>
        <AlertStripeInfo className={bem.element('frist')}>
            <p>
                Vi kan ikke behandle søkaden før vi har fått inntektsmeldingen til {søkernavn}. For å unngå at
                utbetalingen fra NAV til {søkernavn} blir forsinket, må du sende inn inntektsmeldingen til NAV så snart
                som mulig.
            </p>
            <p>
                Hvis du allerede har sendt inntektsmeldingen i tråd med {søkernavn} sin nåværende søknad, kan du se bort
                fra denne meldingen.
            </p>
        </AlertStripeInfo>

        <Element style={{ marginTop: '2rem' }}>Slik sender du inntektsmeldingen</Element>
        <ul>
            <li>
                Bruk enten deres eget lønns- eller personalsystem, eller send meldingen på{' '}
                <Lenke href="https://nav.no" target="_blank">
                    nav.no
                </Lenke>
            </li>
            <li>I inntektsmeldingen, legg inn inntekten til {søkernavn}</li>
            <li>
                Fyll inn startdato <strong>{prettifyDate(fom)}</strong>. Hvis datoen ikke stemmer med det som er avtalt
                mellom dere, må du avklare dette med {søkernavn} før du sender inntektsmeldingen. Ved feil dato, må
                {søkernavn} sende inn en ny søknad.
            </li>
        </ul>

        <p>
            Du kan lese mer om inntektsmeldingen på{' '}
            <Lenke href="https://nav.no/inntektsmelding" target="_blank">
                nav.no/inntektsmelding
            </Lenke>
            .
        </p>
    </div>
);

export default ArbeidsgiverUtskrift;
