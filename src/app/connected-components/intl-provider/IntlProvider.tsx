import * as React from 'react';
import { connect } from 'react-redux';
import { addLocaleData, IntlProvider as Provider } from 'react-intl';
import * as nbLocaleData from 'react-intl/locale-data/nb';
import * as nnLocaleData from 'react-intl/locale-data/nn';

import { AppState, Locale } from '../../types/AppState';

const bokmålstekster = require('../../i18n/nb.json');
const nynorsktekster = require('../../i18n/nn.json');

interface IntlProviderProps {
    locale: Locale;
}

class IntlProvider extends React.Component<IntlProviderProps> {
    constructor(props: IntlProviderProps) {
        super(props);
        addLocaleData([...nbLocaleData, ...nnLocaleData]);
    }

    render() {
        const messages = this.props.locale === 'nb' ? bokmålstekster : nynorsktekster;
        return (
            <Provider key={this.props.locale} locale={this.props.locale} messages={messages || {}}>
                {this.props.children}
            </Provider>
        );
    }
}

const mapStateToProps = (state: AppState): IntlProviderProps => ({
    locale: state.locale
});

export default connect(mapStateToProps)(IntlProvider);
