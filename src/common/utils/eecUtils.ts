const eecCountries: string[] = [
    'BE',
    'BG',
    'DK',
    'EE',
    'FI',
    'FR',
    'GR',
    'IE',
    'IS',
    'IT',
    'HR',
    'CY',
    'LV',
    'LI',
    'LT',
    'LU',
    'MT',
    'NL',
    'PL',
    'PT',
    'RO',
    'SK',
    'SI',
    'ES',
    'GB',
    'SE',
    'CZ',
    'DE',
    'HU',
    'AT',
    'CH'
];

export const isMemberOfEEC = (isoCode: string): boolean => {
    return eecCountries.find((code) => code === isoCode) !== undefined && isoCode !== 'AQ';
};

export const isNotMemberOfEEC = (isoCode: string): boolean => {
    return isMemberOfEEC(isoCode) === false;
};
