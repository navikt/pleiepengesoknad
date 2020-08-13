import { getCountryName } from '@sif-common/formik/';
import { BostedUtland } from '@sif-common/forms/bosted-utland/types';
import { formatDateToApiFormat } from '@sif-common/core/utils/dateUtils';
import { BostedUtlandApiData } from '../../types/PleiepengesøknadApiData';

export const mapBostedUtlandToApiData = (opphold: BostedUtland, locale: string): BostedUtlandApiData => ({
    landnavn: getCountryName(opphold.landkode, locale),
    landkode: opphold.landkode,
    fraOgMed: formatDateToApiFormat(opphold.fom),
    tilOgMed: formatDateToApiFormat(opphold.tom),
});
