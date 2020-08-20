import * as React from 'react';
import { useIntl } from 'react-intl';
import LoadingSpinner from '@sif-common/core/components/loading-spinner/LoadingSpinner';
import Page from '@sif-common/core/components/page/Page';
import intlHelper from '@sif-common/core/utils/intlUtils';

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
