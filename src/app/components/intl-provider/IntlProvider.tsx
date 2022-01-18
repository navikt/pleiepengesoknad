import * as React from 'react';
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
import omsorgstilbudMessages from '../../i18n/omsorgstilbudMessages';
import arbeidstidMessages from '../../søknad/arbeid-i-periode-steps/arbeidstidMessages';
import { arbeidstidPeriodeMessages } from '@navikt/sif-common-pleiepenger/lib/arbeidstid-periode/arbeidstidPeriodeMessages';
import arbeidstidEnkeltdagFormMessages from '@navikt/sif-common-pleiepenger/lib/arbeidstid-enkeltdag/arbeidstidEnkeltdagMessages';
import omsorgstilbudEnkeltdagFormMessages from '@navikt/sif-common-pleiepenger/lib/omsorgstilbud-enkeltdag/omsorgstilbudEnkeltdagFormMessages';
import tidEnkeltdagMessages from '@navikt/sif-common-pleiepenger/lib/tid-enkeltdag-dialog/tidEnkeltdagMessages';
import { omsorgstibudPeriodeMessages } from '@navikt/sif-common-pleiepenger/lib/omsorgstilbud-periode/omsorgstilbudPeriodeMessages';

export const appBokmålstekster = require('../../i18n/nb.json');
export const appNynorsktekster = require('../../i18n/nn.json');

const bokmålstekster = {
    ...allCommonMessages.nb,
    ...utenlandsoppholdMessages.nb,
    ...bostedMessages.nb,
    ...virksomhetMessages.nb,
    ...tidsperiodeMessages.nb,
    ...ferieuttakMessages.nb,
    ...omsorgstilbudMessages.nb,
    ...arbeidstidMessages.nb,
    ...arbeidstidPeriodeMessages.nb,
    ...arbeidstidEnkeltdagFormMessages.nb,
    ...omsorgstilbudEnkeltdagFormMessages.nb,
    ...omsorgstibudPeriodeMessages.nb,
    ...tidEnkeltdagMessages.nb,
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
