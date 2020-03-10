import { getCountryName } from '@navikt/sif-common-formik/lib';
import { Utenlandsopphold } from 'common/forms/utenlandsopphold/types';
import { YesOrNo } from 'common/types/YesOrNo';
import { countryIsMemberOfEøsOrEfta } from 'common/utils/countryUtils';
import { formatDateToApiFormat } from 'common/utils/dateUtils';
import {
    UtenlandsoppholdIPeriodenApiData, UtenlandsoppholdUtenforEøsIPeriodenApiData
} from '../../types/PleiepengesøknadApiData';

export const mapUtenlandsoppholdIPeriodenToApiData = (
    opphold: Utenlandsopphold,
    locale: string
): UtenlandsoppholdIPeriodenApiData => {
    const erUtenforEØS: boolean = countryIsMemberOfEøsOrEfta(opphold.landkode) === false;
    const apiData: UtenlandsoppholdIPeriodenApiData = {
        landnavn: getCountryName(opphold.landkode, locale),
        landkode: opphold.landkode,
        fra_og_med: formatDateToApiFormat(opphold.fom),
        til_og_med: formatDateToApiFormat(opphold.tom)
    };

    if (erUtenforEØS && opphold.årsak) {
        const periodeopphold: UtenlandsoppholdUtenforEøsIPeriodenApiData = {
            ...apiData,
            er_utenfor_eos: erUtenforEØS,
            er_barnet_innlagt: opphold.erBarnetInnlagt === YesOrNo.YES,
            arsak: opphold.erBarnetInnlagt === YesOrNo.YES ? opphold.årsak : null
        };
        return periodeopphold;
    } else {
        return apiData;
    }
};
