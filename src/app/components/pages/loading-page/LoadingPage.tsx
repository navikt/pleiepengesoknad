import * as React from 'react';
import Page from 'common/components/page/Page';
import LoadingSpinner from 'common/components/loading-spinner/LoadingSpinner';
import intlHelper from 'common/utils/intlUtils';
import { injectIntl, WrappedComponentProps } from 'react-intl';

const LoadingPage: React.FunctionComponent<WrappedComponentProps> = ({ intl }) => (
    <Page title={intlHelper(intl, 'page.loadingPage.tekst')}>
        <div style={{ display: 'flex', justifyContent: 'center', minHeight: '15rem', alignItems: 'center' }}>
            <LoadingSpinner type="XXL" />
        </div>
    </Page>
);

export default injectIntl(LoadingPage);
