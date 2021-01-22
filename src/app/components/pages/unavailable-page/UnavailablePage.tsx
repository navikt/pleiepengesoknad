import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { SIFCommonPageKey, useLogSidevisning } from '@navikt/sif-common-amplitude';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import Lenke from 'nav-frontend-lenker';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import StepBanner from '@navikt/sif-common-core/lib/components/step-banner/StepBanner';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import './unavailablePage.less';

const bem = bemUtils('introPage');

const link = 'https://www.nav.no/soknader/nb/person/familie/pleiepenger-og-opplaringspenger';

const UnavailablePage = () => {
    const intl = useIntl();
    const title = intlHelper(intl, 'application.title');
    useLogSidevisning(SIFCommonPageKey.ikkeTilgjengelig);
    return (
        <Page className={bem.block} title={title} topContentRenderer={() => <StepBanner text={title} />}>
            <Box margin="xxxl">
                <AlertStripeAdvarsel>
                    <p>
                        <FormattedMessage id="page.unavailable.1" />{' '}
                        <strong>
                            <Lenke href={link}>
                                <FormattedMessage id="page.unavailable.2" />
                            </Lenke>
                        </strong>
                        .
                    </p>
                    <p>
                        <FormattedMessage id="page.unavailable.3" />
                    </p>
                </AlertStripeAdvarsel>
            </Box>
        </Page>
    );
};

export default UnavailablePage;
