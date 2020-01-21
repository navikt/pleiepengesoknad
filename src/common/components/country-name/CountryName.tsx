import React from 'react';
import { useIntl } from 'react-intl';
import { getCountryName } from '../country-select/CountrySelect';

interface Props {
    countryCode: string;
}

const CountryName: React.FunctionComponent<Props> = ({ countryCode }) => {
    const intl = useIntl();
    return <>{getCountryName(countryCode, intl.locale)}</>;
};

export default CountryName;
