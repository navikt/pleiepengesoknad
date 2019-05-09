import * as React from 'react';
import FrontPageBanner from '../../front-page-banner/FrontPageBanner';
import Page from '../../page/Page';
import Lenke from 'nav-frontend-lenker';
import Box from '../../box/Box';
import { Innholdstittel } from 'nav-frontend-typografi';
import './ikkeMyndigPage.less';

const IkkeMyndigPage: React.FunctionComponent = () => (
    <Page
        className="ikkeMyndigPage"
        title="Søknad om pleiepenger - ikke myndig"
        topContentRenderer={() => (
            <FrontPageBanner
                bannerSize="xlarge"
                counsellorWithSpeechBubbleProps={{
                    strongText: `Hei!`,
                    normalText:
                        'Fordi du er under 18 år, må en av foreldrene dine eller en foresatt skrive under på søknaden sammen med deg. Du må derfor fylle ut søknaden på papir og sende den i posten.',
                    bottomContent: (
                        <Lenke
                            href="https://www.nav.no/no/Person/Skjemaer-for-privatpersoner/skjemaveileder/vedlegg?key=333802&languagecode=53&veiledertype=privatperson"
                            target="_blank">
                            Her kan du laste ned papirsøknaden
                        </Lenke>
                    )
                }}
            />
        )}>
        <Box margin="xxxl">
            <Innholdstittel>Søknad om pleiepenger</Innholdstittel>
        </Box>
    </Page>
);

export default IkkeMyndigPage;
