import { UtenlandskNæringApi } from '../../types/søknad-api-data/SøknadApiData';
import { UtenlandskNæringSøknadsdata } from '../../types/søknadsdata/utenlandskNæringSøknadsdata';
import { getCountryName } from '@navikt/sif-common-formik/lib';
import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';

export const getUtenlandskNæringSøknadsdata = (
    locale: string,
    utenlandskNæring?: UtenlandskNæringSøknadsdata
): UtenlandskNæringApi[] => {
    if (utenlandskNæring?.type === 'harUtenlandskNæring') {
        const apiData: UtenlandskNæringApi[] = utenlandskNæring.utenlandskNæring.map((næring) => ({
            næringstype: næring.næringstype,
            navnPåVirksomheten: næring.navnPåVirksomheten,
            identifikasjonsnummer: næring.identifikasjonsnummer,
            land: {
                landnavn: getCountryName(næring.land, locale),
                landkode: næring.land,
            },
            fraOgMed: formatDateToApiFormat(næring.fraOgMed),
            tilOgMed: næring.tilOgMed ? formatDateToApiFormat(næring.tilOgMed) : undefined,
        }));

        return apiData;
    }

    if (utenlandskNæring?.type === 'harIkkeUtenlandskNæring') {
        return [];
    }

    return [];
};
