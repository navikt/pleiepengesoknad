import { getCountryName } from '@navikt/sif-common-formik';
import { BostedUtland } from '@navikt/sif-common-forms/lib/bosted-utland/types';
import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { BostedUtlandApiData } from '../../types/PleiepengesøknadApiData';

export const mapBostedUtlandToApiData = (opphold: BostedUtland, locale: string): BostedUtlandApiData => ({
    landnavn: getCountryName(opphold.landkode, locale),
    landkode: opphold.landkode,
    fraOgMed: formatDateToApiFormat(opphold.fom),
    tilOgMed: formatDateToApiFormat(opphold.tom),
});
