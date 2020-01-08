import * as React from 'react';
import { IntlProvider as Provider } from 'react-intl';

import '@formatjs/intl-pluralrules/polyfill';
import '@formatjs/intl-pluralrules/dist/locale-data/nb';
import '@formatjs/intl-pluralrules/dist/locale-data/nn';

import { Locale } from '../../../common/types/Locale';

const appBokmålstekster = require('../../i18n/nb.json');
const appNynorsktekster = require('../../i18n/nn.json');

// Modultekster
const utenlandsoppholdBokmål = require('../../../common/forms/utenlandsopphold/utenlandsopphold.nb.json');
const utenlandsoppholdNynorsk = require('../../../common/forms/utenlandsopphold/utenlandsopphold.nn.json');

const bokmålstekster = { ...appBokmålstekster, ...utenlandsoppholdBokmål };
const nynorsktekster = { ...appNynorsktekster, ...utenlandsoppholdNynorsk };

export interface IntlProviderProps {
    locale: Locale;
}
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
