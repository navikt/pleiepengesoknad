import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { getCountryName } from '../country-select/CountrySelect';

interface Props {
    countryCode: string;
}

const CountryName: React.FunctionComponent<Props & WrappedComponentProps> = ({ countryCode, intl }) => (
    <>{getCountryName(countryCode, intl.locale)}</>
);

export default injectIntl(CountryName);
