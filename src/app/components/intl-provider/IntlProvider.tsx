import * as React from 'react';
import { IntlProvider as Provider } from 'react-intl';
import '@formatjs/intl-pluralrules/dist/locale-data/nb';
import '@formatjs/intl-pluralrules/dist/locale-data/nn';
import '@formatjs/intl-pluralrules/polyfill';
import bostedMessages from '@navikt/sif-common-forms/lib/bosted-utland/bostedUtlandMessages';
import utenlandsoppholdMessages from '@navikt/sif-common-forms/lib/utenlandsopphold/utenlandsoppholdMessages';
import MessagesPreview from 'common/dev-utils/intl/messages-preview/MessagesPreview';
import { allCommonMessages } from 'common/i18n/allCommonMessages';
import { Locale } from 'common/types/Locale';

const selvstendigMessagesNb = require('../../i18n/selvstendigOgFrilans.nb.json');
const selvstendigMessagesNn = require('../../i18n/selvstendigOgFrilans.nn.json');

const appBokmålstekster = require('../../i18n/nb.json');
const appNynorsktekster = require('../../i18n/nn.json');

const bokmålstekster = {
    ...allCommonMessages.nb,
    ...utenlandsoppholdMessages.nb,
    ...appBokmålstekster,
    ...bostedMessages.nb,
    ...selvstendigMessagesNb,
};
const nynorsktekster = {
    ...allCommonMessages.nn,
    ...utenlandsoppholdMessages.nn,
    ...appNynorsktekster,
    ...bostedMessages.nn,
    ...selvstendigMessagesNn,
};

export interface IntlProviderProps {
    locale: Locale;
    children: React.ReactNode;
    onError?: (error: any) => void;
}

const showMessages = false;

const IntlProvider = ({ locale, onError, children }: IntlProviderProps) => {
    const messages = locale === 'nb' ? bokmålstekster : nynorsktekster;
    return (
        <Provider locale={locale} messages={messages} onError={onError}>
            {children}
            {showMessages && (
                <MessagesPreview
                    title="Søknad pleiepenger"
                    showMissingTextSummary={false}
                    messages={{
                        nb: bokmålstekster,
                        nn: nynorsktekster,
                    }}
                />
            )}
        </Provider>
    );
};

export default IntlProvider;
