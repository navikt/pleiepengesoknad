import { getNumberFromNumberInputValue, YesOrNo } from '@navikt/sif-common-formik/lib';
import { NormalarbeidstidFormData } from '../../types/ArbeidsforholdFormData';
import { NormalarbeidstidSøknadsdata } from '../../types/Søknadsdata';
import { isYesOrNoAnswered } from '../../validation/fieldValidations';

export const extractNormalarbeidstid = (
    normalarbeidstid?: NormalarbeidstidFormData
): NormalarbeidstidSøknadsdata | undefined => {
    if (!normalarbeidstid || isYesOrNoAnswered(normalarbeidstid.erLiktHverUke) === false) {
        return undefined;
    }
    const erLiktHverUke = normalarbeidstid.erLiktHverUke === YesOrNo.YES;
    const fasteDager = erLiktHverUke ? normalarbeidstid.fasteDager : undefined;
    const timerPerUke = !erLiktHverUke ? getNumberFromNumberInputValue(normalarbeidstid.timerPerUke) : undefined;
    if (fasteDager === undefined && timerPerUke === undefined) {
        return undefined;
    }
    return fasteDager ? { fasteDager } : { timerPerUke };
};
