import { Utenlandsopphold } from '@navikt/sif-common-forms/lib';
import { guid, ISODateToDate } from '@navikt/sif-common-utils/lib';
import { BostedUtlandApiData, MedlemskapApiData } from '../../types/søknad-api-data/SøknadApiData';
import { SøknadFormField, SøknadFormValues } from '../../types/SøknadFormValues';
import { booleanToYesOrNo } from '../booleanToYesOrNo';

type MedlesskapFormValues = Pick<
    SøknadFormValues,
    | SøknadFormField.harBoddUtenforNorgeSiste12Mnd
    | SøknadFormField.skalBoUtenforNorgeNeste12Mnd
    | SøknadFormField.utenlandsoppholdSiste12Mnd
    | SøknadFormField.utenlandsoppholdNeste12Mnd
>;

export const mapBostedUtlandToUtenlandsopphold = (bostedUtland: BostedUtlandApiData): Utenlandsopphold => {
    return {
        id: guid(),
        fom: ISODateToDate(bostedUtland.fraOgMed),
        tom: ISODateToDate(bostedUtland.tilOgMed),
        landkode: bostedUtland.landkode,
    };
};

export const extractMedlemsskapFormValues = ({
    harBoddIUtlandetSiste12Mnd,
    skalBoIUtlandetNeste12Mnd,
    utenlandsoppholdNeste12Mnd,
    utenlandsoppholdSiste12Mnd,
}: MedlemskapApiData): MedlesskapFormValues => {
    return {
        harBoddUtenforNorgeSiste12Mnd: booleanToYesOrNo(harBoddIUtlandetSiste12Mnd),
        skalBoUtenforNorgeNeste12Mnd: booleanToYesOrNo(skalBoIUtlandetNeste12Mnd),
        utenlandsoppholdNeste12Mnd: utenlandsoppholdNeste12Mnd.map(mapBostedUtlandToUtenlandsopphold),
        utenlandsoppholdSiste12Mnd: utenlandsoppholdSiste12Mnd.map(mapBostedUtlandToUtenlandsopphold),
    };
};
