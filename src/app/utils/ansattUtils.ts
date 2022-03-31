import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { ArbeidsforholdFormData, ArbeidsforholdFrilanserFormData } from '../types/ArbeidsforholdFormData';

export const erAnsattHosArbeidsgiverISøknadsperiode = (arbeidsforhold: ArbeidsforholdFormData): boolean => {
    return (
        arbeidsforhold.erAnsatt === YesOrNo.YES ||
        (arbeidsforhold.erAnsatt === YesOrNo.NO && arbeidsforhold.sluttetFørSøknadsperiode === YesOrNo.NO)
    );
};

export const harFraværIArbeidsforhold = (
    arbeidsforhold?: ArbeidsforholdFormData | ArbeidsforholdFrilanserFormData
): boolean => {
    return arbeidsforhold !== undefined && arbeidsforhold.harFraværIPeriode === YesOrNo.YES;
};

export const erAnsattISøknadsperiode = (arbeidsforhold: ArbeidsforholdFormData[]): boolean => {
    return arbeidsforhold.some(erAnsattHosArbeidsgiverISøknadsperiode);
};

export const harFraværFraArbeidsforholdIPeriode = (arbeidsforhold: ArbeidsforholdFormData[]): boolean => {
    return arbeidsforhold.some(harFraværIArbeidsforhold);
};
