import { Locale } from '@navikt/sif-common-core-ds/lib/types/Locale';
import { SøknadApiData } from '../../types/søknad-api-data/SøknadApiData';
import { UtenlandsoppholdIPeriodenSøknadsdata } from '../../types/søknadsdata/utenlandsoppholdIPeriodenSøknadsdata';
import { YesOrNo } from '@navikt/sif-common-core-ds/lib/types/YesOrNo';
import { dateToISODate } from '@navikt/sif-common-utils';
import { countryIsMemberOfEøsOrEfta, getCountryName } from '@navikt/sif-common-formik-ds';
import { DateTidsperiode } from '@navikt/sif-common-forms-ds/lib/forms/tidsperiode';
import { Utenlandsopphold } from '@navikt/sif-common-forms-ds/lib/forms/utenlandsopphold/types';
import {
    PeriodeApiData,
    UtenlandsoppholdIPeriodenApiData,
    UtenlandsoppholdUtenforEøsIPeriodenApiData,
} from '../../types/søknad-api-data/SøknadApiData';
import { sortItemsByFomTom } from '../../local-sif-common-pleiepenger/utils';

const mapBarnInnlagtPeriodeToApiFormat = (periode: DateTidsperiode): PeriodeApiData => {
    return {
        fraOgMed: dateToISODate(periode.fom),
        tilOgMed: dateToISODate(periode.tom),
    };
};

export type UtenlandsoppholdIPerioden = Pick<SøknadApiData, 'utenlandsoppholdIPerioden'>;

export const mapUtenlandsoppholdIPeriodenApiData = (
    opphold: Utenlandsopphold,
    locale: string
): UtenlandsoppholdIPeriodenApiData => {
    const erUtenforEØS: boolean = countryIsMemberOfEøsOrEfta(opphold.landkode) === false;
    const apiData: UtenlandsoppholdIPeriodenApiData = {
        landnavn: getCountryName(opphold.landkode, locale),
        landkode: opphold.landkode,
        fraOgMed: dateToISODate(opphold.fom),
        tilOgMed: dateToISODate(opphold.tom),
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

export const getUtenlandsoppholdIPeriodenApiDataFromSøknadsdata = (
    locale: Locale,
    utenlandsoppholdIPerioden?: UtenlandsoppholdIPeriodenSøknadsdata
): UtenlandsoppholdIPerioden => {
    if (utenlandsoppholdIPerioden === undefined) {
        throw Error('utenlandsoppholdIPeriodenSøknadsdata undefined');
    }

    switch (utenlandsoppholdIPerioden?.type) {
        case 'skalOppholdeSegIUtlandet':
            const { opphold } = utenlandsoppholdIPerioden;

            if (opphold.length === 0) {
                throw Error('utenlandsopphold er tomt');
            }
            return {
                utenlandsoppholdIPerioden: {
                    skalOppholdeSegIUtlandetIPerioden: true,
                    opphold: opphold.map((o) => mapUtenlandsoppholdIPeriodenApiData(o, locale)),
                },
            };
        case 'skalIkkeOppholdeSegIUtlandet':
            return {
                utenlandsoppholdIPerioden: {
                    skalOppholdeSegIUtlandetIPerioden: false,
                    opphold: [],
                },
            };
    }
};
