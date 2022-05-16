import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { ArbeidsforholdFormData } from '../types/ArbeidsforholdFormData';

export const erAnsattHosArbeidsgiverISøknadsperiode = (arbeidsforhold: ArbeidsforholdFormData): boolean => {
    return (
        arbeidsforhold.erAnsatt === YesOrNo.YES ||
        (arbeidsforhold.erAnsatt === YesOrNo.NO && arbeidsforhold.sluttetFørSøknadsperiode === YesOrNo.NO)
    );
};

export const erAnsattISøknadsperiode = (arbeidsforhold: ArbeidsforholdFormData[]): boolean => {
    return arbeidsforhold.some(erAnsattHosArbeidsgiverISøknadsperiode);
};
