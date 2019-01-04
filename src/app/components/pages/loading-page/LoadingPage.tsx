import * as React from 'react';
import Page from '../../page/Page';
import LoadingSpinner from '../../loading-spinner/LoadingSpinner';

const LoadingPage: React.FunctionComponent = () => (
    <Page title="Laster...">
        <LoadingSpinner />
    </Page>
);

export default LoadingPage;
