import React from 'react';
import Box from '@sif-common/core/components/box/Box';
import bemUtils from '@sif-common/core/utils/bemUtils';
import { prettifyDate } from '@sif-common/core/utils/dateUtils';
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

const ArbeidsgiverUtskrift = ({ arbeidsgiver, søkernavn, fom, tom }: Props) => (
    <div className={bem.block}>
        <Systemtittel style={{ marginBottom: '1.5rem' }}>Til {arbeidsgiver}</Systemtittel>
        <p>NAV har mottatt følgende opplysninger:</p>
        <p>
            <strong>
                {søkernavn} er ansatt hos {arbeidsgiver}
            </strong>
        </p>
        <p>
            <strong>{søkernavn} søker om Pleiepenger for perioden:</strong>
            <ul>
                <li>
                    <strong>{prettifyDate(fom)}</strong> til <strong>{prettifyDate(tom)}</strong>
                </li>
            </ul>
        </p>
        <Box margin="xl">
            <AlertStripeInfo className={bem.element('frist')}>
                <p>
                    For at arbeidstaker skal få raskt svar på søknaden sin, ber vi om at inntektsmeldingen blir sendt
                    til oss så snart som mulig.{' '}
                </p>

                <p>
                    <strong>Det er viktig at du krysser av for at inntektsmeldingen gjelder pleiepenger</strong>.
                </p>

                <p>Hvis inntektsmeldingen allerede er sendt, kan du se bort fra denne meldingen.</p>
            </AlertStripeInfo>
        </Box>

        <Element style={{ marginTop: '2rem' }}>Slik sender du inntektsmeldingen</Element>
        <p>
            Inntektsmeldingen sendes fra arbeidsgivers eget lønns- og personalsystem eller fra altinn.no. Meldingen
            inneholder inntektsopplysninger og annen informasjon NAV må ha for å behandle søknaden arbeidstaker har
            sendt. Husk å velge riktig inntektsmelding.
        </p>

        <p>
            Fyll inn startdato som samsvarer med arbeidstakers søknad.{' '}
            <strong>
                {søkernavn} har søkt pleiepenger fra {prettifyDate(fom)}
            </strong>{' '}
            . Hvis datoen ikke stemmer med hva dere har avtalt, må dere avklare dette dere imellom før du sender
            inntektsmeldingen.
        </p>

        <p>
            Du får mer informasjon om inntektsmeldingen på{' '}
            <Lenke href="https://nav.no/inntektsmelding" target="_blank">
                nav.no/inntektsmelding
            </Lenke>
            .
        </p>
    </div>
);

export default ArbeidsgiverUtskrift;
