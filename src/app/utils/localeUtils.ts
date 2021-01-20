import { Locale } from '@navikt/sif-common-core/lib/types/Locale';

const LocaleSessionKey = 'selectedLocale';

export const getLocaleFromSessionStorage = (): Locale => {
    return (sessionStorage.getItem(LocaleSessionKey) as Locale) || 'nb';
};

export const setLocaleInSessionStorage = (locale: Locale): void => {
    sessionStorage.setItem(LocaleSessionKey, locale);
};
