import { getCountryName } from '@navikt/sif-common-formik';
import { Utenlandsopphold } from '@navikt/sif-common-forms/lib/utenlandsopphold/types';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { countryIsMemberOfEøsOrEfta } from '@navikt/sif-common-core/lib/utils/countryUtils';
import { formatDateToApiFormat, sortItemsByFomTom } from '@navikt/sif-common-core/lib/utils/dateUtils';
import {
    UtenlandsoppholdIPeriodenApiData,
    UtenlandsoppholdUtenforEøsIPeriodenApiData,
    PeriodeBarnetErInnlagtApiData,
} from '../../types/SøknadApiData';
import { DateTidsperiode } from '@navikt/sif-common-forms/lib/tidsperiode';

const mapBarnInnlagtPeriodeToApiFormat = (periode: DateTidsperiode): PeriodeBarnetErInnlagtApiData => {
    return {
        fraOgMed: formatDateToApiFormat(periode.fom),
        tilOgMed: formatDateToApiFormat(periode.tom),
    };
};

export const getUtenlandsoppholdIPeriodenApiData = (
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
