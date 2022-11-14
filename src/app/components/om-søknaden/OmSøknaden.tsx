import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import Lenke from 'nav-frontend-lenker';
import { Undertittel } from 'nav-frontend-typografi';
import getLenker from '../../lenker';

const OmSøknaden = () => {
    const intl = useIntl();
    return (
        <Box margin="xl">
            <Undertittel>Slik søker du</Undertittel>
            <p>
                I søknaden stiller vi kun de spørsmålene som er relevante i din situasjon. Du må svare på alle
                spørsmålene for å kunne gå videre. Du får veiledning underveis om hva du skal fylle ut og hvordan.
                Mangler du dokumentasjon, kan du ettersende dette.
            </p>

            <ExpandableInfo title="Vi tar vare på søknaden din underveis">
                <p>
                    Når du har startet søknaden, tar vi vare på søknaden for deg i 72 timer. På den måten trenger du
                    ikke fylle inn på nytt det du allerede har svart på. Om du velger å avbryte utfyllingen uten å
                    lagre, blir opplysningene du har lagt inn slettet. Vi lagrer søknaden hver gang du går videre fra
                    ett steg til neste.
                </p>
                <p>
                    Dersom du blir automatisk logget ut mens du er i søknadsdialogen, vil du komme tilbake til dit du
                    var i søknadsdialogen når du logger inn på nytt.
                </p>
            </ExpandableInfo>
            <ExpandableInfo title="Vil vil hente og bruke informasjon om deg">
                <p>I tillegg til den informasjonen du oppgir i søknaden, henter vi:</p>
                <ul className="infoList">
                    <li>Personinformasjon om deg og barna dine fra Folkeregisteret.</li>
                    <li>Opplysninger om arbeidsforholdet ditt fra Arbeidsgiver- og arbeidstakerregisteret.</li>
                    <li>Opplysninger om deg vi har fra før.</li>
                </ul>
                <p>Dette gjør vi for å ...</p>
                <p>
                    <Lenke
                        href="https://www.dev.nav.no/no/nav-og-samfunn/om-nav/personvern-i-arbeids-og-velferdsetaten/personvernerklaering-for-arbeids-og-velferdsetaten"
                        target="_blank">
                        Du kan lese mer om hvordan NAV behandler personopplysninger på nav.no (åpnes i ny fane).
                    </Lenke>
                </p>
            </ExpandableInfo>
            <ExpandableInfo title="Dine plikter">
                <p>
                    Vi stoler på at du svarer så godt som du kan på spørsmålene, og at du forstår at det kan få
                    konsekvenser for retten din til pleiepenger hvis du gir uriktig informasjon eller holder tilbake
                    opplysninger.
                </p>
                <p>
                    Du kan lese mer om dine plikter på{' '}
                    <Lenke href={getLenker(intl.locale).rettOgPlikt} target="_blank">
                        nav.no/rettOgPlikt
                    </Lenke>
                    .
                </p>
            </ExpandableInfo>
        </Box>
    );
};

export default OmSøknaden;
