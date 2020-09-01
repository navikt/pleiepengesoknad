import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Ingress, Systemtittel } from 'nav-frontend-typografi';
import Veilederpanel from 'nav-frontend-veilederpanel';
import Box from '@sif-common/core/components/box/Box';
import Page from '@sif-common/core/components/page/Page';
import intlHelper from '@sif-common/core/utils/intlUtils';
import VeilederLokal from './VeilederLokal';

export interface Props {
    error?: Error | any;
}

const GeneralErrorPage = ({ error }: Props) => {
    const intl = useIntl();
    // TODO: Legg på sentry logging av error
    return (
        <Page title={intlHelper(intl, 'page.generalErrorPage.sidetittel')}>
            <div style={{ paddingTop: '1rem' }}>
                <Veilederpanel type="plakat" kompakt={true} fargetema="normal" svg={<VeilederLokal mood="uncertain" />}>
                    <Systemtittel tag="h2">
                        <FormattedMessage id="page.generalErrorPage.tittel" />
                    </Systemtittel>
                    <Box margin="m" padBottom="l">
                        <Ingress>
                            <FormattedMessage id="page.generalErrorPage.tekst" />
                        </Ingress>
                    </Box>
                </Veilederpanel>
            </div>
        </Page>
    );
};

export default GeneralErrorPage;
