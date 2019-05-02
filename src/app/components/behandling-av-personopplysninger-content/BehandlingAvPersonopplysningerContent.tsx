import * as React from 'react';
import { Ingress, Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';
import Box from '../box/Box';
import './behandlingAvPersonopplysningerContent.less';

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
                vilkårene. Vilkårene står på{' '}
                <Lenke
                    href="https://www.nav.no/no/Person/Familie/Sykdom+i+familien/pleiepenger+for+pleie+av+sykt+barn"
                    target="_blank">
                    nav.no/pleiepenger.
                </Lenke>
            </Normaltekst>
        </Box>

        <Box margin="xl">
            <Ingress>Opplysningene vi innhenter</Ingress>
            <Normaltekst>Opplysningene kommer enten fra deg eller fra offentlige registre:</Normaltekst>
            <ul>
                <li>arbeidsforholdene dine og inntekten din</li>
                <li>ytelser du mottar fra NAV</li>
                <li>opplysninger om barnets helse</li>
                <li>tilknytningen din til Norge</li>
                <li>trygdeordninger du kan ha rett til i andre land</li>
            </ul>
            <Normaltekst>Vi kan også sende opplysninger om deg til trygdemyndigheter i andre land. </Normaltekst>
        </Box>

        <Box margin="xl">
            <Ingress>Svar på søknaden</Ingress>
            <Normaltekst>Du får et brev fra NAV når søknaden din er behandlet. Brevet inneholder</Normaltekst>
            <ul>
                <li>begrunnelse for beslutningen og reglene som er brukt</li>
                <li>hvordan du får innsyn i saksbehandlingen</li>
                <li>hvordan du kan klage hvis du er uenig</li>
            </ul>
        </Box>

        <Box margin="xl">
            <Ingress>Personvern i NAV</Ingress>
            <Normaltekst>
                Vil du vite mer om hvordan NAV behandler personopplysninger? Se{' '}
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
