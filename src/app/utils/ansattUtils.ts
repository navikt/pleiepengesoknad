import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { ArbeidsforholdAnsatt, ArbeidsforholdSluttetNårSvar } from '../types/PleiepengesøknadFormData';

export const erAnsattHosArbeidsgiverISøknadsperiode = (arbeidsgiver: ArbeidsforholdAnsatt): boolean => {
    return (
        arbeidsgiver.erAnsatt === YesOrNo.YES ||
        (arbeidsgiver.erAnsatt === YesOrNo.NO &&
            arbeidsgiver.sluttetNår === ArbeidsforholdSluttetNårSvar.iSøknadsperiode)
    );
};

export const erAnsattISøknadsperiode = (arbeidsgivere: ArbeidsforholdAnsatt[]): boolean => {
    return arbeidsgivere.some(erAnsattHosArbeidsgiverISøknadsperiode);
};
