import React from 'react';
import { getCountryName } from '../country-select/CountrySelect';
import { useIntl } from 'react-intl';

interface Props {
    countryCode: string;
}

const CountryName: React.FunctionComponent<Props> = ({ countryCode }) => {
    const intl = useIntl();
    return <>{getCountryName(countryCode, intl.locale)}</>;
};

export default CountryName;
