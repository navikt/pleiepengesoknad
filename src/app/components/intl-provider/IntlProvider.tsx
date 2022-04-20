import React from 'react';
import { IntlProvider as Provider } from 'react-intl';
import '@formatjs/intl-pluralrules/locale-data/nb';
import '@formatjs/intl-pluralrules/locale-data/nn';
import '@formatjs/intl-pluralrules/polyfill';
import { allCommonMessages } from '@navikt/sif-common-core/lib/i18n/allCommonMessages';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import bostedMessages from '@navikt/sif-common-forms/lib/bosted-utland/bostedUtlandMessages';
import ferieuttakMessages from '@navikt/sif-common-forms/lib/ferieuttak/ferieuttakMessages';
import tidsperiodeMessages from '@navikt/sif-common-forms/lib/tidsperiode/tidsperiodeMessages';
import utenlandsoppholdMessages from '@navikt/sif-common-forms/lib/utenlandsopphold/utenlandsoppholdMessages';
import virksomhetMessages from '@navikt/sif-common-forms/lib/virksomhet/virksomhetMessages';
import { sifCommonPleiepengerMessages } from '@navikt/sif-common-pleiepenger/lib/i18n/index';
import omsorgstilbudMessages from '../../i18n/omsorgstilbudMessages';
import arbeidstidMessages from '../../søknad/arbeidstid-step/components/arbeidstid-variert/arbeidstidVariertMessages';

export const appBokmålstekster = require('../../i18n/nb.json');

const bokmålstekster = {
    ...allCommonMessages.nb,
    ...utenlandsoppholdMessages.nb,
    ...bostedMessages.nb,
    ...virksomhetMessages.nb,
    ...tidsperiodeMessages.nb,
    ...ferieuttakMessages.nb,
    ...omsorgstilbudMessages.nb,
    ...arbeidstidMessages.nb,
    ...sifCommonPleiepengerMessages.nb,
    ...appBokmålstekster,
};

export interface IntlProviderProps {
    locale: Locale;
    children: React.ReactNode;
    onError?: (error: any) => void;
}

const IntlProvider = ({ locale, onError, children }: IntlProviderProps) => {
    // const messages = locale === 'nb' ? bokmålstekster : nynorsktekster;
    return (
        <Provider locale={locale} messages={bokmålstekster} onError={onError}>
            {children}
        </Provider>
    );
};

export default IntlProvider;
