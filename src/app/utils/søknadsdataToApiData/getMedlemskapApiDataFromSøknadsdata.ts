import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { getCountryName } from '@navikt/sif-common-formik/lib';
import { BostedUtland } from '@navikt/sif-common-forms/lib';
import { BostedUtlandApiData, MedlemskapApiData } from '../../types/SøknadApiData';
import { MedlemskapSøknadsdata } from '../../types/Søknadsdata';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';

const mapBostedUtlandToApi = (opphold: BostedUtland, locale: string): BostedUtlandApiData => ({
    landnavn: getCountryName(opphold.landkode, locale),
    landkode: opphold.landkode,
    fraOgMed: formatDateToApiFormat(opphold.fom),
    tilOgMed: formatDateToApiFormat(opphold.tom),
});

export const getMedlemskapApiDataFromSøknadsdata = (
    locale: Locale,
    medlemskapSøknadsdata?: MedlemskapSøknadsdata
): MedlemskapApiData => {
    if (medlemskapSøknadsdata === undefined) {
        return {
            harBoddIUtlandetSiste12Mnd: false,
            utenlandsoppholdSiste12Mnd: [],
            skalBoIUtlandetNeste12Mnd: false,
            utenlandsoppholdNeste12Mnd: [],
        };
    }
    switch (medlemskapSøknadsdata?.type) {
        case 'IkkeHarBodIkkeSkalBo':
            return {
                harBoddIUtlandetSiste12Mnd: medlemskapSøknadsdata.harBoddUtenforNorgeSiste12Mnd,
                utenlandsoppholdSiste12Mnd: [],
                skalBoIUtlandetNeste12Mnd: medlemskapSøknadsdata.skalBoUtenforNorgeNeste12Mnd,
                utenlandsoppholdNeste12Mnd: [],
            };
        case 'HarBodSkalBo':
            return {
                harBoddIUtlandetSiste12Mnd: medlemskapSøknadsdata.harBoddUtenforNorgeSiste12Mnd,
                utenlandsoppholdSiste12Mnd: medlemskapSøknadsdata.utenlandsoppholdSiste12Mnd.map((o) =>
                    mapBostedUtlandToApi(o, locale)
                ),

                skalBoIUtlandetNeste12Mnd: medlemskapSøknadsdata.skalBoUtenforNorgeNeste12Mnd,
                utenlandsoppholdNeste12Mnd: medlemskapSøknadsdata.utenlandsoppholdNeste12Mnd.map((o) =>
                    mapBostedUtlandToApi(o, locale)
                ),
            };

        case 'HarBod':
            return {
                harBoddIUtlandetSiste12Mnd: medlemskapSøknadsdata.harBoddUtenforNorgeSiste12Mnd,
                utenlandsoppholdSiste12Mnd: medlemskapSøknadsdata.utenlandsoppholdSiste12Mnd.map((o) =>
                    mapBostedUtlandToApi(o, locale)
                ),
                skalBoIUtlandetNeste12Mnd: medlemskapSøknadsdata.skalBoUtenforNorgeNeste12Mnd,
                utenlandsoppholdNeste12Mnd: [],
            };
        case 'SkalBo':
            return {
                harBoddIUtlandetSiste12Mnd: medlemskapSøknadsdata.harBoddUtenforNorgeSiste12Mnd,
                utenlandsoppholdSiste12Mnd: [],
                skalBoIUtlandetNeste12Mnd: medlemskapSøknadsdata.skalBoUtenforNorgeNeste12Mnd,
                utenlandsoppholdNeste12Mnd: medlemskapSøknadsdata.utenlandsoppholdNeste12Mnd.map((o) =>
                    mapBostedUtlandToApi(o, locale)
                ),
            };
    }
};
