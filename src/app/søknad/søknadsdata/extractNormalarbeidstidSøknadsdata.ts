import { getNumberFromNumberInputValue, YesOrNo } from '@navikt/sif-common-formik/lib';
import {
    decimalDurationToDuration,
    durationToDecimalDuration,
    DurationWeekdays,
    summarizeDateDurationMap,
} from '@navikt/sif-common-utils/lib';
import { NormalarbeidstidFormData } from '../../types/ArbeidsforholdFormData';
import { NormalarbeidstidSøknadsdata } from '../../types/Søknadsdata';
import { isYesOrNoAnswered } from '../../validation/fieldValidations';

const timerPerUkeTilFasteDager = (timer: number): DurationWeekdays => {
    const tidPerDag = decimalDurationToDuration(timer / 5);
    return {
        monday: tidPerDag,
        tuesday: tidPerDag,
        wednesday: tidPerDag,
        thursday: tidPerDag,
        friday: tidPerDag,
    };
};

export const extractNormalarbeidstid = (
    normalarbeidstid?: NormalarbeidstidFormData
): NormalarbeidstidSøknadsdata | undefined => {
    if (!normalarbeidstid || isYesOrNoAnswered(normalarbeidstid.erLiktHverUke) === false) {
        return undefined;
    }
    const erLiktHverUke = normalarbeidstid.erLiktHverUke === YesOrNo.YES;
    if (erLiktHverUke) {
        if (normalarbeidstid.fasteDager) {
            return {
                erLiktHverUke: true,
                fasteDager: normalarbeidstid.fasteDager,
                timerPerUke: durationToDecimalDuration(summarizeDateDurationMap(normalarbeidstid.fasteDager)),
            };
        }
    }
    const timerPerUke = getNumberFromNumberInputValue(normalarbeidstid.timerPerUke);
    if (!erLiktHverUke && timerPerUke !== undefined) {
        return {
            erLiktHverUke: false,
            timerPerUke,
            fasteDager: timerPerUkeTilFasteDager(timerPerUke),
        };
    }
    return undefined;
};
