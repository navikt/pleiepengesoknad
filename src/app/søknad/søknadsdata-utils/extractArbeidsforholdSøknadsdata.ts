import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { ArbeidsforholdFormData, ArbeidsforholdFrilanserFormData } from '../../types/ArbeidsforholdFormData';
import { ArbeidsforholdSøknadsdata } from '../../types/Søknadsdata';
import { isYesOrNoAnswered } from '../../validation/fieldValidations';
import { extractNormalarbeidstid } from './extractNormalarbeidstidSøknadsdata';

export const extractArbeidsforholdSøknadsdata = (
    arbeidsforhold?: ArbeidsforholdFrilanserFormData | ArbeidsforholdFormData
): ArbeidsforholdSøknadsdata | undefined => {
    if (!arbeidsforhold) {
        return undefined;
    }
    const harFraværIPeriode = isYesOrNoAnswered(arbeidsforhold.harFraværIPeriode)
        ? arbeidsforhold.harFraværIPeriode === YesOrNo.YES
        : undefined;

    const normalarbeidstid = extractNormalarbeidstid(arbeidsforhold.normalarbeidstid);

    if (!normalarbeidstid || harFraværIPeriode === undefined) {
        return undefined;
    }

    return {
        normalarbeidstid,
        harFraværIPeriode,
    };
};
