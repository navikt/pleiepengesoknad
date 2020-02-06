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
const bostedUtlandBokmål = require('../../../common/forms/bosted-utland/bostedUtland.nb.json');
const bostedUtlandNynorsk = require('../../../common/forms/bosted-utland/bostedUtland.nn.json');
const pictureScanningGuideBokmål = require('../../../common/components/picture-scanning-guide/picturescanningguide.nb.json');
const pictureScanningGuideNynorsk = require('../../../common/components/picture-scanning-guide/picturescanningguide.nn.json');
const commonFieldValidationNb = require('../../../common/i18n/validationErrors.nb.json');
const commonFieldValidationNn = require('../../../common/i18n/validationErrors.nn.json');

const bokmålstekster = {
    ...appBokmålstekster,
    ...utenlandsoppholdBokmål,
    ...pictureScanningGuideBokmål,
    ...bostedUtlandBokmål,
    ...commonFieldValidationNb
};
const nynorsktekster = {
    ...appNynorsktekster,
    ...utenlandsoppholdNynorsk,
    ...pictureScanningGuideNynorsk,
    ...bostedUtlandNynorsk,
    ...commonFieldValidationNn
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
