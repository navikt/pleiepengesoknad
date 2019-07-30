import * as React from 'react';
import Page from '../../page/Page';
import LoadingSpinner from '../../loading-spinner/LoadingSpinner';
import intlHelper from 'app/utils/intlUtils';
import { injectIntl, InjectedIntlProps } from 'react-intl';

const LoadingPage: React.FunctionComponent<InjectedIntlProps> = ({ intl }) => (
    <Page title={intlHelper(intl, 'page.loadingPage.sidetittel')}>
        <LoadingSpinner type="XXL" />
    </Page>
);

export default injectIntl(LoadingPage);
