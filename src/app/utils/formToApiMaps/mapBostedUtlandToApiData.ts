import {
    getCountryName
} from '@navikt/sif-common/lib/common/components/country-select/CountrySelect';
import { BostedUtland } from '@navikt/sif-common/lib/common/forms/bosted-utland/types';
import { formatDateToApiFormat } from '@navikt/sif-common/lib/common/utils/dateUtils';
import { BostedUtlandApiData } from '../../types/PleiepengesøknadApiData';

export const mapBostedUtlandToApiData = (opphold: BostedUtland, locale: string): BostedUtlandApiData => ({
    landnavn: getCountryName(opphold.landkode, locale),
    landkode: opphold.landkode,
    fra_og_med: formatDateToApiFormat(opphold.fom),
    til_og_med: formatDateToApiFormat(opphold.tom)
});
