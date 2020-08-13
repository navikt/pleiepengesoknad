import * as React from 'react';
import { IntlProvider as Provider } from 'react-intl';
import '@formatjs/intl-pluralrules/dist/locale-data/nb';
import '@formatjs/intl-pluralrules/dist/locale-data/nn';
import '@formatjs/intl-pluralrules/polyfill';
import bostedMessages from '@sif-common/forms/bosted-utland/bostedUtlandMessages';
import utenlandsoppholdMessages from '@sif-common/forms/utenlandsopphold/utenlandsoppholdMessages';
import virksomhetMessages from '@sif-common/forms/virksomhet/virksomhetMessages';
import tidsperiodeMessages from '@sif-common/forms/tidsperiode/tidsperiodeMessages';
import ferieuttakMessages from '@sif-common/forms/ferieuttak/ferieuttakMessages';
import { allCommonMessages } from '@sif-common/core/i18n/allCommonMessages';
import { Locale } from '@sif-common/core/types/Locale';

export const appBokmålstekster = require('../../i18n/nb.json');
export const appNynorsktekster = require('../../i18n/nn.json');

const bokmålstekster = {
    ...allCommonMessages.nb,
    ...utenlandsoppholdMessages.nb,
    ...bostedMessages.nb,
    ...virksomhetMessages.nb,
    ...tidsperiodeMessages.nb,
    ...ferieuttakMessages.nb,
    ...appBokmålstekster,
};
const nynorsktekster = {
    ...allCommonMessages.nn,
    ...utenlandsoppholdMessages.nn,
    ...bostedMessages.nn,
    ...virksomhetMessages.nn,
    ...tidsperiodeMessages.nn,
    ...ferieuttakMessages.nn,
    ...appNynorsktekster,
};

export interface IntlProviderProps {
    locale: Locale;
    children: React.ReactNode;
    onError?: (error: any) => void;
}

const IntlProvider = ({ locale, onError, children }: IntlProviderProps) => {
    const messages = locale === 'nb' ? bokmålstekster : nynorsktekster;
    return (
        <Provider locale={locale} messages={messages} onError={onError}>
            {children}
        </Provider>
    );
};

export default IntlProvider;
