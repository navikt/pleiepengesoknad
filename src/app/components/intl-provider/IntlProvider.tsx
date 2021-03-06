import * as React from 'react';
import { IntlProvider as Provider } from 'react-intl';
import '@formatjs/intl-pluralrules/locale-data/nb';
import '@formatjs/intl-pluralrules/locale-data/nn';
import '@formatjs/intl-pluralrules/polyfill';
import bostedMessages from '@navikt/sif-common-forms/lib/bosted-utland/bostedUtlandMessages';
import utenlandsoppholdMessages from '@navikt/sif-common-forms/lib/utenlandsopphold/utenlandsoppholdMessages';
import virksomhetMessages from '@navikt/sif-common-forms/lib/virksomhet/virksomhetMessages';
import tidsperiodeMessages from '@navikt/sif-common-forms/lib/tidsperiode/tidsperiodeMessages';
import ferieuttakMessages from '@navikt/sif-common-forms/lib/ferieuttak/ferieuttakMessages';
import { allCommonMessages } from '@navikt/sif-common-core/lib/i18n/allCommonMessages';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';

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
