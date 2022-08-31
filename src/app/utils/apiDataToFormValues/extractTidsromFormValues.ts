import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { Ferieuttak, Utenlandsopphold, UtenlandsoppholdFormValues } from '@navikt/sif-common-forms/lib';
import { guid, ISODateToDate } from '@navikt/sif-common-utils/lib';
import {
    FerieuttakIPeriodenApiData,
    PeriodeApiData,
    SøknadApiData,
    isUtenlandsoppholdUtenforEØSApiData,
    UtenlandsoppholdIPeriodenApiData,
    UtenlandsoppholdUtenforEøsIPeriodenApiData,
    UtenlandsoppholdIPeriodenSøknadApiData,
} from '../../types/søknad-api-data/SøknadApiData';
import { SøknadFormField, SøknadFormValues } from '../../types/SøknadFormValues';
import { booleanToYesOrNo, booleanToYesOrNoOrUnanswered } from '../booleanToYesOrNo';

type MedsøkerFormValues = Pick<SøknadFormValues, SøknadFormField.samtidigHjemme | SøknadFormField.harMedsøker>;
type FerieIPeriodenFormValues = Pick<
    SøknadFormValues,
    SøknadFormField.skalTaUtFerieIPerioden | SøknadFormField.ferieuttakIPerioden
>;
type UtenlandsoppholdIPeriodenFormValues = Pick<
    SøknadFormValues,
    SøknadFormField.skalOppholdeSegIUtlandetIPerioden | SøknadFormField.utenlandsoppholdIPerioden
>;
type TidsromFormValues = MedsøkerFormValues & UtenlandsoppholdIPeriodenFormValues & FerieIPeriodenFormValues;

const mapPeriodeApiDataToFerieuttak = (ferieuttak: PeriodeApiData): Ferieuttak => ({
    id: guid(),
    fom: ISODateToDate(ferieuttak.fraOgMed),
    tom: ISODateToDate(ferieuttak.tilOgMed),
});

export const extractMedsøkerFormValues = (søknad: SøknadApiData): MedsøkerFormValues => {
    return {
        [SøknadFormField.harMedsøker]: booleanToYesOrNo(søknad.harMedsøker),
        [SøknadFormField.samtidigHjemme]: booleanToYesOrNoOrUnanswered(søknad.samtidigHjemme),
    };
};

export const extractFerieIPeriodenFormValues = (
    ferieuttakIPerioden?: FerieuttakIPeriodenApiData
): FerieIPeriodenFormValues => {
    if (!ferieuttakIPerioden || ferieuttakIPerioden.skalTaUtFerieIPerioden === false) {
        return {
            skalTaUtFerieIPerioden: YesOrNo.NO,
        };
    }
    return {
        [SøknadFormField.skalTaUtFerieIPerioden]: YesOrNo.YES,
        [SøknadFormField.ferieuttakIPerioden]: ferieuttakIPerioden.ferieuttak.map(mapPeriodeApiDataToFerieuttak),
    };
};

export const mapUtenlandsoppholdApiDataToUtenlandsopphold = (
    utenlandsopphold: UtenlandsoppholdIPeriodenApiData | UtenlandsoppholdUtenforEøsIPeriodenApiData
): Utenlandsopphold => {
    const { fraOgMed, tilOgMed, landkode } = utenlandsopphold;
    if (isUtenlandsoppholdUtenforEØSApiData(utenlandsopphold)) {
        const { årsak, erBarnetInnlagt, perioderBarnetErInnlagt } = utenlandsopphold;
        return {
            fom: ISODateToDate(fraOgMed),
            tom: ISODateToDate(tilOgMed),
            landkode,
            erBarnetInnlagt: booleanToYesOrNo(erBarnetInnlagt),
            årsak: årsak && årsak !== null ? årsak : undefined,
            barnInnlagtPerioder: perioderBarnetErInnlagt.map((p) => ({
                fom: ISODateToDate(p.fraOgMed),
                tom: ISODateToDate(p.tilOgMed),
            })),
        };
    }
    return {
        fom: ISODateToDate(fraOgMed),
        tom: ISODateToDate(tilOgMed),
        landkode,
    };
};

export const extractUtenlandsoppholdIPeriodenFormValues = (
    utenlandsopphold?: UtenlandsoppholdIPeriodenSøknadApiData
): UtenlandsoppholdIPeriodenFormValues => {
    if (
        !utenlandsopphold ||
        utenlandsopphold.skalOppholdeSegIUtlandetIPerioden === false ||
        utenlandsopphold.opphold === undefined
    ) {
        return {
            skalOppholdeSegIUtlandetIPerioden: YesOrNo.NO,
        };
    }
    const utenlandsoppholdIPerioden: Utenlandsopphold[] = utenlandsopphold.opphold.map(
        mapUtenlandsoppholdApiDataToUtenlandsopphold
    );
    return {
        skalOppholdeSegIUtlandetIPerioden: YesOrNo.YES,
        utenlandsoppholdIPerioden,
    };
};

export const extractTidsromFormValues = (søknad: SøknadApiData): Partial<TidsromFormValues> | undefined => {
    return {
        ...extractMedsøkerFormValues(søknad),
        ...extractFerieIPeriodenFormValues(søknad.ferieuttakIPerioden),
        ...extractUtenlandsoppholdIPeriodenFormValues(søknad.utenlandsoppholdIPerioden),
    };
};
