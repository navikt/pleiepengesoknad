import * as countries from 'i18n-iso-countries';

countries.registerLocale(require('i18n-iso-countries/langs/nb.json'));
countries.registerLocale(require('i18n-iso-countries/langs/nn.json'));

export const eøsAndEftaCountries = {
    BE: true,
    BG: true,
    DK: true,
    EE: true,
    FI: true,
    FR: true,
    GR: true,
    IE: true,
    IS: true,
    IT: true,
    HR: true,
    CY: true,
    LV: true,
    LI: true,
    LT: true,
    LU: true,
    MT: true,
    NL: true,
    PL: true,
    PT: true,
    RO: true,
    SK: true,
    SI: true,
    ES: true,
    GB: true,
    SE: true,
    CZ: true,
    DE: true,
    HU: true,
    AT: true,
    CH: true
};

const ANTARTICA = 'AQ';

const isoCodeIndex = 0;
const countryNameIndex = 1;

export interface Country {
    isoCode: string;
    name: string;
}

export const countryIsMemberOfEøsOrEfta = (isoCode: string) => {
    return eøsAndEftaCountries[isoCode] === true;
};

export const getCountriesForLocale = (locale: string, onlyEøsOrEftaCountries?: boolean): Country[] => {
    return Object.entries(countries.getNames(locale))
        .filter((countryOptionValue: string[]) =>
            onlyEøsOrEftaCountries
                ? countryIsMemberOfEøsOrEfta(countryOptionValue[isoCodeIndex])
                : countryOptionValue[isoCodeIndex] !== ANTARTICA
        )
        .sort((a: string[], b: string[]) => a[1].localeCompare(b[1], locale))
        .map((countryOptionValue: string[]) => ({
            isoCode: countryOptionValue[isoCodeIndex],
            name: countryOptionValue[countryNameIndex]
        }));
};
