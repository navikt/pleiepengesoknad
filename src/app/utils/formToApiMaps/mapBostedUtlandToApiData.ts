import { getCountryName, } from '@navikt/sif-common-formik/lib';
import { BostedUtland, } from 'common/forms/bosted-utland/types';
import { formatDateToApiFormat, } from 'common/utils/dateUtils';
import { BostedUtlandApiData, } from '../../types/PleiepengesøknadApiData';

export const mapBostedUtlandToApiData = (opphold: BostedUtland, locale: string): BostedUtlandApiData => ({
    landnavn: getCountryName(opphold.landkode, locale),
    landkode: opphold.landkode,
    fraOgMed: formatDateToApiFormat(opphold.fom),
    tilOgMed: formatDateToApiFormat(opphold.tom)
});
