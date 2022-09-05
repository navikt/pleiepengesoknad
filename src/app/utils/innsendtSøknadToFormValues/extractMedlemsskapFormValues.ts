import { DateRange } from '@navikt/sif-common-formik/lib';
import { BostedUtland } from '@navikt/sif-common-forms/lib';
import { guid, ISODateToDate } from '@navikt/sif-common-utils/lib';
import { BostedUtlandApiData, MedlemskapApiData } from '../../types/søknad-api-data/SøknadApiData';
import { SøknadFormField, SøknadFormValues } from '../../types/SøknadFormValues';
import { booleanToYesOrNo } from '../booleanToYesOrNo';
import { getMedlemsskapDateRanges } from '../medlemsskapUtils';

type MedlesskapFormValues = Pick<
    SøknadFormValues,
    | SøknadFormField.harBoddUtenforNorgeSiste12Mnd
    | SøknadFormField.skalBoUtenforNorgeNeste12Mnd
    | SøknadFormField.utenlandsoppholdSiste12Mnd
    | SøknadFormField.utenlandsoppholdNeste12Mnd
>;

export const mapBostedUtlandApiDataToBostedUtland = (bostedUtland: BostedUtlandApiData): BostedUtland => {
    return {
        id: guid(),
        fom: ISODateToDate(bostedUtland.fraOgMed),
        tom: ISODateToDate(bostedUtland.tilOgMed),
        landkode: bostedUtland.landkode,
    };
};

export const refordelUtenlandsoppholdUtFraNyDagensDato = (
    bostedUtland: BostedUtlandApiData[],
    søknadsdato: Date
): { bostedSiste12Måneder: BostedUtland[]; bostedNeste12Måneder: BostedUtland[] } => {
    const dateranges = getMedlemsskapDateRanges(søknadsdato);
    const bostedSiste12Måneder: BostedUtland[] = [];
    const bostedNeste12Måneder: BostedUtland[] = [];
    bostedUtland.forEach((bostedApiData) => {
        const bosted = mapBostedUtlandApiDataToBostedUtland(bostedApiData);
        const periode: DateRange = {
            from: bosted.fom,
            to: bosted.tom,
        };
        console.log(periode, dateranges);
        // if (dateRangeUtils.isDateInDateRange)
        // if (dayjs(bosted.tom).isBefore(dateToday, "day")) {

        // }
    });
    return {
        bostedNeste12Måneder,
        bostedSiste12Måneder,
    };
};

export const extractMedlemsskapFormValues = ({
    harBoddIUtlandetSiste12Mnd,
    skalBoIUtlandetNeste12Mnd,
    utenlandsoppholdNeste12Mnd,
    utenlandsoppholdSiste12Mnd,
}: MedlemskapApiData): MedlesskapFormValues => {
    // const bosteder = refordelUtenlandsoppholdUtFraNyDagensDato(
    //     [...utenlandsoppholdSiste12Mnd, ...utenlandsoppholdNeste12Mnd],
    //     dateToday
    // );
    return {
        harBoddUtenforNorgeSiste12Mnd: booleanToYesOrNo(harBoddIUtlandetSiste12Mnd),
        utenlandsoppholdSiste12Mnd: utenlandsoppholdSiste12Mnd.map(mapBostedUtlandApiDataToBostedUtland),
        skalBoUtenforNorgeNeste12Mnd: booleanToYesOrNo(skalBoIUtlandetNeste12Mnd),
        utenlandsoppholdNeste12Mnd: utenlandsoppholdNeste12Mnd.map(mapBostedUtlandApiDataToBostedUtland),
    };
};
