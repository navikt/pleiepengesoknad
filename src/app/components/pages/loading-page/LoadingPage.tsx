import * as React from 'react';
import { useIntl } from 'react-intl';
import LoadingSpinner from 'common/components/loading-spinner/LoadingSpinner';
import Page from 'common/components/page/Page';
import intlHelper from 'common/utils/intlUtils';

const LoadingPage = () => {
    const intl = useIntl();
    return (
        <Page title={intlHelper(intl, 'page.loadingPage.tekst')}>
            <div style={{ display: 'flex', justifyContent: 'center', minHeight: '15rem', alignItems: 'center' }}>
                <LoadingSpinner type="XXL" />
            </div>
        </Page>
    );
};

export default LoadingPage;
