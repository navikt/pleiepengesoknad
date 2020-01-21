import * as React from 'react';
import { IntlShape, injectIntl, WrappedComponentProps } from 'react-intl';
import { Select } from 'nav-frontend-skjema';

import * as countries from 'i18n-iso-countries';
import { SkjemaelementFeil } from 'nav-frontend-skjema/lib/skjemaelement-feilmelding';
countries.registerLocale(require('i18n-iso-countries/langs/nb.json'));
countries.registerLocale(require('i18n-iso-countries/langs/nn.json'));

interface StateProps {
    label: React.ReactNode;
    name: string;
    defaultValue?: string;
    onChange: (countryCode: string) => void;
    showOnlyEuAndEftaCountries?: boolean;
    feil?: SkjemaelementFeil;
}

export type ChangeEvent = React.ChangeEvent<HTMLSelectElement>;

type Props = StateProps & WrappedComponentProps;

interface CountryOptionsCache {
    locale: string;
    options: React.ReactNode[];
}

const isoCodeIndex = 0;
const countryNameIndex = 1;

class CountrySelect extends React.Component<Props> {
    countryOptionsCache: CountryOptionsCache;
    constructor(props: Props) {
        super(props);
        this.getCountryOptions = this.getCountryOptions.bind(this);
        this.updateCache = this.updateCache.bind(this);
    }

    updateCache(intl: IntlShape) {
        this.countryOptionsCache = {
            locale: intl.locale,
            options: createCountryOptions(
                this.props.showOnlyEuAndEftaCountries ? this.props.showOnlyEuAndEftaCountries : false,
                intl
            )
        };
    }

    getCountryOptions(intl: IntlShape): React.ReactNode[] {
        if (!this.countryOptionsCache || intl.locale !== this.countryOptionsCache.locale) {
            this.updateCache(intl);
        }
        return this.countryOptionsCache.options;
    }

    render() {
        const { onChange, name, showOnlyEuAndEftaCountries, intl, ...restProps } = this.props;
        return (
            <Select name={name} {...restProps} onChange={(e) => onChange(e.target.value)}>
                <option value="" />
                {this.getCountryOptions(intl)}
            </Select>
        );
    }
}

const filteredListEØSCountries = (countryOptionValue: string, shouldFilter?: boolean) => {
    if (shouldFilter) {
        switch (countryOptionValue) {
            case 'BE':
            case 'BG':
            case 'DK':
            case 'EE':
            case 'FI':
            case 'FR':
            case 'GR':
            case 'IE':
            case 'IS':
            case 'IT':
            case 'HR':
            case 'CY':
            case 'LV':
            case 'LI':
            case 'LT':
            case 'LU':
            case 'MT':
            case 'NL':
            case 'PL':
            case 'PT':
            case 'RO':
            case 'SK':
            case 'SI':
            case 'ES':
            case 'GB':
            case 'SE':
            case 'CZ':
            case 'DE':
            case 'HU':
            case 'AT':
            case 'CH':
                return true;
            default:
                return false;
        }
    } else {
        // Filter ut Antarktis
        return countryOptionValue !== 'AQ';
    }
};

const createCountryOptions = (onluEuAndEftaCountries: boolean, intl: IntlShape): React.ReactNode[] => {
    const locale = intl.locale;

    return Object.entries(countries.getNames(locale))
        .sort((a: string[], b: string[]) => a[1].localeCompare(b[1], locale))
        .filter((countryOptionValue: string[]) =>
            filteredListEØSCountries(countryOptionValue[isoCodeIndex], onluEuAndEftaCountries)
        )
        .map((countryOptionValue: string[]) => (
            <option key={countryOptionValue[isoCodeIndex]} value={countryOptionValue[isoCodeIndex]}>
                {countryOptionValue[countryNameIndex]}
            </option>
        ));
};

export const getCountryName = (isoCode: string, locale: string): string => {
    const names = countries.getNames(locale);
    return names[isoCode];
};

export default injectIntl(CountrySelect);
