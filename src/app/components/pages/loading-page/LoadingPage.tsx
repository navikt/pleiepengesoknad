import * as React from 'react';
import Page from '../../page/Page';
import LoadingSpinner from '../../loading-spinner/LoadingSpinner';
import intlHelper from '../../../utils/intlUtils';
import { injectIntl, InjectedIntlProps } from 'react-intl';

const LoadingPage: React.FunctionComponent<InjectedIntlProps> = ({ intl }) => (
    <Page title={intlHelper(intl, 'page.loadingPage.tekst')}>
        <div style={{ display: 'flex', justifyContent: 'center', minHeight: '15rem', alignItems: 'center' }}>
            <LoadingSpinner type="XXL" />
        </div>
    </Page>
);

export default injectIntl(LoadingPage);
