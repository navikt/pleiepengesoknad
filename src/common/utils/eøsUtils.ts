const eøsCountries: string[] = [
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

export const isMemberOfEØS = (isoCode: string): boolean => {
    return eøsCountries.find((code) => code === isoCode) !== undefined && isoCode !== 'AQ';
};
