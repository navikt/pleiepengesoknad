import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import Page from '../../../components/page/Page';

class WelcomingPage extends React.Component<InjectedIntlProps> {
    render() {
        const { intl } = this.props;
        return (
            <Page title="Velkommen til søknad om pleiepenger">
                <h2>Welcoming page</h2>
                <span>{intl.formatMessage({ id: 'sample' })}</span>
            </Page>
        );
    }
}

export default injectIntl(WelcomingPage);
