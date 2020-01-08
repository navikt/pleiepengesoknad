import React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { getCountryName } from '../country-select/CountrySelect';

interface Props {
    countryCode: string;
}

const CountryName: React.FunctionComponent<Props & InjectedIntlProps> = ({ countryCode, intl }) => (
    <>{getCountryName(countryCode, intl.locale)}</>
);

export default injectIntl(CountryName);
