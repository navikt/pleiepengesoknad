import * as React from 'react';
import { Ingress, Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';
import Box from '../box/Box';

const BehandlingAvPersonopplysningerContent: React.FunctionComponent = () => (
    <>
        <Systemtittel>Slik behandler NAV personopplysningene dine</Systemtittel>

        <Box margin="l">
            <Normaltekst>
                NAV innhenter og mottar opplysninger om deg når du sender inn en søknad. Det er nødvendig for at du skal
                kunne få riktig tjeneste og ytelser.
            </Normaltekst>
            <Normaltekst>
                Du har valgt å søke om pleiepenger. Det er en ytelse fra folketrygden som du kan få hvis du fyller
                vilkårene. Vilkårene står{' '}
                <Lenke
                    href="https://www.nav.no/no/Person/Familie/Sykdom+i+familien/pleiepenger+for+pleie+av+sykt+barn"
                    target="_blank">
                    her.
                </Lenke>
            </Normaltekst>
        </Box>

        <Box margin="l">
            <Ingress>Opplysninger vi innhenter fra deg og offentlige registre</Ingress>
            <Normaltekst>For å behandle søknaden din henter vi inn opplysninger om</Normaltekst>
            <ul>
                <li>tilknytningen din til Norge, arbeidsforholdene dine og inntekten din</li>
                <li>ytelser du mottar fra NAV</li>
                <li>trygdeordninger du kan ha rett til i andre land</li>
            </ul>
            <Normaltekst>Vi kan også sende opplysninger om deg til trygdeordninger i andre land.</Normaltekst>
        </Box>

        <Box margin="l">
            <Ingress>Svar på søknaden</Ingress>
            <Normaltekst>Når søknaden din er behandlet, får du et vedtaksbrev. Det forteller deg om</Normaltekst>
            <ul>
                <li>begrunnelse for beslutningen</li>
                <li>hvordan du får innsyn i saksbehandlingen og reglene som er blitt brukt</li>
                <li>hvordan du kan klage hvis du er uenig</li>
            </ul>
            <Normaltekst>Vi kan også sende opplysninger om deg til trygdeordninger i andre land.</Normaltekst>
        </Box>

        <Box margin="l">
            <Ingress>Personvernerklæringen i NAV</Ingress>
            <Normaltekst>
                Du kan lese mer om hvordan NAV behandler personopplysninger i Arbeids- og velferdsetatens
                personvernerklæring på{' '}
                <Lenke
                    href="https://www.nav.no/no/NAV+og+samfunn/Om+NAV/personvern-i-arbeids-og-velferdsetaten/personvernerkl%C3%A6ring-for-arbeids-og-velferdsetaten"
                    target="_blank">
                    nav.no/personvern.
                </Lenke>
            </Normaltekst>
        </Box>
    </>
);

export default BehandlingAvPersonopplysningerContent;
