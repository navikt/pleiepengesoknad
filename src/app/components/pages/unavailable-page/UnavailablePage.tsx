import * as React from 'react';
import Page from '../../page/Page';
import bemUtils from '../../../utils/bemUtils';
import Box from '../../box/Box';
import StepBanner from '../../step-banner/StepBanner';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Undertittel } from 'nav-frontend-typografi';
import './unavailablePage.less';

const bem = bemUtils('introPage');

const UnavailablePage: React.StatelessComponent<{}> = () => {
    const title = 'Søknad om pleiepenger';
    return (
        <Page className={bem.block} title={title} topContentRenderer={() => <StepBanner text={title} />}>
            <Box margin="xxxl">
                <AlertStripeAdvarsel>
                    <Box padBottom="s">
                        <Undertittel>Pleiepengesøknaden er ikke tilgjengelig akkurat nå</Undertittel>
                    </Box>
                    <p>
                        Vi har dessverre tekniske problemer med pleiepengesøknaden, så vi må be deg komme tilbake litt
                        senere.
                    </p>
                    <p>Vi beklager dette.</p>
                </AlertStripeAdvarsel>
            </Box>
        </Page>
    );
};

export default UnavailablePage;
