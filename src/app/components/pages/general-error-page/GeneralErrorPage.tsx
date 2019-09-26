import * as React from 'react';
import Page from '../../page/Page';
import { Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import Box from '../../box/Box';
import { injectIntl, WrappedComponentProps, FormattedMessage } from 'react-intl';
import intlHelper from 'app/utils/intlUtils';

const GeneralErrorPage: React.FunctionComponent<WrappedComponentProps> = ({ intl }) => (
    <Page title={intlHelper(intl, 'page.generalErrorPage.sidetittel')}>
        <Innholdstittel>
            <FormattedMessage id="page.generalErrorPage.tittel" />
        </Innholdstittel>
        <Box margin="l">
            <Normaltekst>
                <FormattedMessage id="page.generalErrorPage.tekst" />
            </Normaltekst>
        </Box>
    </Page>
);

export default injectIntl(GeneralErrorPage);
