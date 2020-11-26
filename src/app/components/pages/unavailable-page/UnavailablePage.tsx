import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import intlHelper from '@sif-common/core/utils/intlUtils';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import Lenke from 'nav-frontend-lenker';
import Box from '@sif-common/core/components/box/Box';
import Page from '@sif-common/core/components/page/Page';
import StepBanner from '@sif-common/core/components/step-banner/StepBanner';
import bemUtils from '@sif-common/core/utils/bemUtils';
import './unavailablePage.less';

const bem = bemUtils('introPage');

const link = 'https://www.nav.no/soknader/nb/person/familie/pleiepenger-og-opplaringspenger';

const UnavailablePage: React.StatelessComponent<{}> = () => {
    const intl = useIntl();
    const title = intlHelper(intl, 'application.title');
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
