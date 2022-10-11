import { getNumberFromNumberInputValue, YesOrNo } from '@navikt/sif-common-formik/lib';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger/lib';
import { NormalarbeidstidFormData } from '../../types/ArbeidsforholdFormData';
import { NormalarbeidstidSøknadsdata } from '../../types/søknadsdata/Søknadsdata';

export const ExtractNormalarbeidstidFailed = 'ExtractNormalarbeidstid failed';

export const extractNormalarbeidstid = (
    normalarbeidstid: NormalarbeidstidFormData | undefined,
    arbeidsforholdType: ArbeidsforholdType
): NormalarbeidstidSøknadsdata | undefined => {
    if (!normalarbeidstid) {
        return undefined;
    }
    if (arbeidsforholdType === ArbeidsforholdType.ANSATT && normalarbeidstid.erLiktSomForrigeSøknad === YesOrNo.YES) {
        const timerPerUkeISnitt = getNumberFromNumberInputValue(normalarbeidstid.timerPerUke);
        if (timerPerUkeISnitt === undefined) {
            return undefined;
        }

        return {
            timerPerUkeISnitt,
        };
    }

    const timerPerUkeISnitt = getNumberFromNumberInputValue(normalarbeidstid.timerPerUke);
    return timerPerUkeISnitt !== undefined
        ? {
              timerPerUkeISnitt,
          }
        : undefined;
};
