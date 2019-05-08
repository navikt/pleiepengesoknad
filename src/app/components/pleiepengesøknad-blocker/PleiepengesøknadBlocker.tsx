import * as React from 'react';
import FrontPageBanner from '../front-page-banner/FrontPageBanner';
import Page from '../page/Page';

const PleiepengesøknadBlocker: React.FunctionComponent = () => (
    <Page
        title="Søknad om pleiepenger"
        topContentRenderer={() => (
            <FrontPageBanner
                counsellorWithSpeechBubbleProps={{
                    strongText: `Hei!`,
                    normalText:
                        'Fordi du er under 18 år, må en av foreldrene dine eller en foresatt skrive under på søknaden sammen med deg. Du må derfor fylle ut søknaden på papir og sende den i posten.'
                }}
            />
        )}>
        Content
    </Page>
);

export default PleiepengesøknadBlocker;
