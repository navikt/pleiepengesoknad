import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
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
        <Systemtittel style={{ marginBottom: '1.5rem' }}>Til {arbeidsgiver}</Systemtittel>
        <p>
            <Element tag="span">Vi har mottatt følgende opplysninger:</Element>
        </p>
        <p>
            {søkernavn} er ansatt hos {arbeidsgiver}
        </p>
        <p>
            {søkernavn} søker om Pleiepenger for perioden
            <ul>
                <li>
                    <strong>{prettifyDate(fom)}</strong> til <strong>{prettifyDate(tom)}</strong>
                </li>
            </ul>
        </p>
        <Box margin="xl">
            <AlertStripeInfo className={bem.element('frist')}>
                <p>
                    Vi kan ikke behandle søkaden før vi har fått inntektsmeldingen til {søkernavn}. For å unngå at
                    utbetalingen fra NAV til {søkernavn} blir forsinket, må du sende inn inntektsmeldingen til NAV så
                    snart som mulig.
                </p>
                <p>
                    Hvis du allerede har sendt inntektsmeldingen i tråd med {søkernavn} sin nåværende søknad, kan du se
                    bort fra denne meldingen.
                </p>
            </AlertStripeInfo>
        </Box>

        <Element style={{ marginTop: '2rem' }}>Slik sender du inntektsmeldingen</Element>
        <p>
            Inntektsmeldingen sendes fra arbeidsgivers eget lønns- og personalsystem eller fra altinn.no. Meldingen
            inneholder inntektsopplysninger og annen informasjon NAV må ha for å behandle søknaden arbeidstaker har
            sendt.
        </p>
        <p>
            Fyll inn startdato som samsvarer med arbeidstakers søknad. Navn Navnesen har søkt pleiepenger fra 1. februar
            2020. Hvis datoen ikke stemmer med hva dere har avtalt, må dere avklare dette dere imellom før du sender
            inntektsmeldingen.
        </p>
        <p>
            Du får mer informasjon om inntektsmeldingen på
            <Lenke href="https://nav.no/inntektsmelding" target="_blank">
                nav.no/inntektsmelding
            </Lenke>
            .
        </p>
    </div>
);

export default ArbeidsgiverUtskrift;
