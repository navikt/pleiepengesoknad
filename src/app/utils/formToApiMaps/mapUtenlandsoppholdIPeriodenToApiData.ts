import {
    getCountryName
} from '@navikt/sif-common/lib/common/components/country-select/CountrySelect';
import { Utenlandsopphold } from '@navikt/sif-common/lib/common/forms/utenlandsopphold/types';
import { YesOrNo } from '@navikt/sif-common/lib/common/types/YesOrNo';
import { countryIsMemberOfEøsOrEfta } from '@navikt/sif-common/lib/common/utils/countryUtils';
import { formatDateToApiFormat } from '@navikt/sif-common/lib/common/utils/dateUtils';
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
