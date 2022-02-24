import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { Arbeidsforhold, ArbeidsforholdFrilanser } from '../types/Arbeidsforhold';

export const erAnsattHosArbeidsgiverISøknadsperiode = (arbeidsforhold: Arbeidsforhold): boolean => {
    return (
        arbeidsforhold.erAnsatt === YesOrNo.YES ||
        (arbeidsforhold.erAnsatt === YesOrNo.NO && arbeidsforhold.sluttetFørSøknadsperiode === YesOrNo.NO)
    );
};

export const harFraværIArbeidsforhold = (arbeidsforhold?: Arbeidsforhold | ArbeidsforholdFrilanser): boolean => {
    return arbeidsforhold !== undefined && arbeidsforhold.harFraværIPeriode === YesOrNo.YES;
};

export const erAnsattISøknadsperiode = (arbeidsforhold: Arbeidsforhold[]): boolean => {
    return arbeidsforhold.some(erAnsattHosArbeidsgiverISøknadsperiode);
};

export const harFraværFraArbeidsforholdIPeriode = (arbeidsforhold: Arbeidsforhold[]): boolean => {
    return arbeidsforhold.some(harFraværIArbeidsforhold);
};
