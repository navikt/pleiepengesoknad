import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Block from '@navikt/sif-common-core-ds/lib/atoms/block/Block';
import Page from '@navikt/sif-common-core-ds/lib/components/page/Page';
import SifGuidePanel from '@navikt/sif-common-core-ds/lib/components/sif-guide-panel/SifGuidePanel';
import intlHelper from '@navikt/sif-common-core-ds/lib/utils/intlUtils';
import { Ingress, Systemtittel } from 'nav-frontend-typografi';

const GeneralErrorPage = () => {
    const intl = useIntl();
    return (
        <Page title={intlHelper(intl, 'page.generalErrorPage.sidetittel')}>
            <div style={{ paddingTop: '1rem' }}>
                <SifGuidePanel poster={true} compact={true} mood="uncertain">
                    <Systemtittel tag="h2">
                        <FormattedMessage id="page.generalErrorPage.tittel" />
                    </Systemtittel>
                    <Block margin="m" padBottom="l">
                        <Ingress>
                            <FormattedMessage id="page.generalErrorPage.tekst" />
                        </Ingress>
                    </Block>
                </SifGuidePanel>
            </div>
        </Page>
    );
};

export default GeneralErrorPage;
