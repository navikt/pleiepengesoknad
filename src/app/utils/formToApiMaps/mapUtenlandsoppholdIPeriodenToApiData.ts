import { getCountryName } from '@sif-common/formik/';
import { Utenlandsopphold } from '@sif-common/forms/utenlandsopphold/types';
import { YesOrNo } from '@sif-common/core/types/YesOrNo';
import { countryIsMemberOfEøsOrEfta } from '@sif-common/core/utils/countryUtils';
import { formatDateToApiFormat, sortItemsByFomTom } from '@sif-common/core/utils/dateUtils';
import {
    UtenlandsoppholdIPeriodenApiData,
    UtenlandsoppholdUtenforEøsIPeriodenApiData,
    PeriodeBarnetErInnlagtApiFormat,
} from '../../types/PleiepengesøknadApiData';
import { DateTidsperiode } from '@sif-common/forms/tidsperiode';

const mapBarnInnlagtPeriodeToApiFormat = (periode: DateTidsperiode): PeriodeBarnetErInnlagtApiFormat => {
    return {
        fraOgMed: formatDateToApiFormat(periode.fom),
        tilOgMed: formatDateToApiFormat(periode.tom),
    };
};

export const mapUtenlandsoppholdIPeriodenToApiData = (
    opphold: Utenlandsopphold,
    locale: string
): UtenlandsoppholdIPeriodenApiData => {
    const erUtenforEØS: boolean = countryIsMemberOfEøsOrEfta(opphold.landkode) === false;
    const apiData: UtenlandsoppholdIPeriodenApiData = {
        landnavn: getCountryName(opphold.landkode, locale),
        landkode: opphold.landkode,
        fraOgMed: formatDateToApiFormat(opphold.fom),
        tilOgMed: formatDateToApiFormat(opphold.tom),
    };

    if (erUtenforEØS && opphold.årsak && opphold.barnInnlagtPerioder) {
        const periodeopphold: UtenlandsoppholdUtenforEøsIPeriodenApiData = {
            ...apiData,
            erUtenforEøs: erUtenforEØS,
            erBarnetInnlagt: opphold.erBarnetInnlagt === YesOrNo.YES,
            perioderBarnetErInnlagt: opphold.barnInnlagtPerioder
                .sort(sortItemsByFomTom)
                .map(mapBarnInnlagtPeriodeToApiFormat),
            årsak: opphold.erBarnetInnlagt === YesOrNo.YES ? opphold.årsak : null,
        };
        return periodeopphold;
    } else {
        return apiData;
    }
};
