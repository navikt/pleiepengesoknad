import * as React from 'react';
import { IntlProvider as Provider } from 'react-intl';
import '@formatjs/intl-pluralrules/dist/locale-data/nb';
import '@formatjs/intl-pluralrules/dist/locale-data/nn';
import '@formatjs/intl-pluralrules/polyfill';
import { allCommonMessages } from 'common/i18n/allCommonMessages';
import { Locale } from 'common/types/Locale';

const selvstendigMessagesNb = require('../../i18n/selvstendigOgFrilans.nb.json');
const selvstendigMessagesNn = require('../../i18n/selvstendigOgFrilans.nn.json');

const appBokmålstekster = require('../../i18n/nb.json');
const appNynorsktekster = require('../../i18n/nn.json');

const bokmålstekster = {
    ...allCommonMessages.nb,
    ...appBokmålstekster,
    ...selvstendigMessagesNb
};
const nynorsktekster = {
    ...allCommonMessages.nn,
    ...appNynorsktekster,
    ...selvstendigMessagesNn
};

export interface IntlProviderProps {
    locale: Locale;
}
export interface IntlProviderProps {
    locale: Locale;
    onError?: (error: any) => void;
}

const IntlProvider: React.FunctionComponent<IntlProviderProps> = ({ locale, onError, children }) => {
    const messages = locale === 'nb' ? bokmålstekster : nynorsktekster;
    return (
        <Provider locale={locale} messages={messages} onError={onError}>
            {children}
        </Provider>
    );
};

export default IntlProvider;
