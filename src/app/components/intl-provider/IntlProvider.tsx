import * as React from 'react';
import { IntlProvider as Provider } from 'react-intl';
import { Locale } from '../../types/Locale';

const bokmålstekster = require('../../i18n/nb.json');
const nynorsktekster = require('../../i18n/nn.json');

export interface IntlProviderProps {
    locale: Locale;
}

const IntlProvider: React.FunctionComponent<IntlProviderProps> = ({ locale, children }) => {
    const messages = locale === 'nb' ? bokmålstekster : nynorsktekster;
    return (
        <Provider locale={locale} messages={messages}>
            {children}
        </Provider>
    );
};

export default IntlProvider;
