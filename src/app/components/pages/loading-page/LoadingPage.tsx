import * as React from 'react';
import Page from '../../page/Page';
import LoadingSpinner from '../../loading-spinner/LoadingSpinner';
import intlHelper from '../../../utils/intlUtils';
import { injectIntl, WrappedComponentProps } from 'react-intl';

const LoadingPage: React.FunctionComponent<WrappedComponentProps> = ({ intl }) => (
    <Page title={intlHelper(intl, 'page.loadingPage.tekst')}>
        <LoadingSpinner type="XXL" />
    </Page>
);

export default injectIntl(LoadingPage);
