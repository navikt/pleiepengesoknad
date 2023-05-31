import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { SIFCommonPageKey, useLogSidevisning } from '@navikt/sif-common-amplitude';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import Lenke from 'nav-frontend-lenker';
import Block from '@navikt/sif-common-core-ds/lib/atoms/block/Block';
import Page from '@navikt/sif-common-core-ds/lib/components/page/Page';

import bemUtils from '@navikt/sif-common-core-ds/lib/utils/bemUtils';
import intlHelper from '@navikt/sif-common-core-ds/lib/utils/intlUtils';
import './unavailablePage.less';

const bem = bemUtils('introPage');

const link = 'https://www.nav.no/soknader/nb/person/familie/pleiepenger-og-opplaringspenger';

const UnavailablePage = () => {
    const intl = useIntl();
    const title = intlHelper(intl, 'application.title');
    useLogSidevisning(SIFCommonPageKey.ikkeTilgjengelig);
    return (
        <Page className={bem.block} title={title} topContentRenderer={() => <h1>title</h1>}>
            <Block margin="xxxl">
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
            </Block>
        </Page>
    );
};

export default UnavailablePage;
