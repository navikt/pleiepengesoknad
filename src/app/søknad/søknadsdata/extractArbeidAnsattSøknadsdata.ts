import { DateRange, YesOrNo } from '@navikt/sif-common-formik/lib';
import { ArbeidsforholdFormData } from '../../types/ArbeidsforholdFormData';
import { ArbeidAnsattSøknadsdata } from '../../types/Søknadsdata';
import { extractArbeidsforholdSøknadsdata } from './extractArbeidsforholdSøknadsdata';

export const extractArbeidAnsattSøknadsdata = (
    arbeidsforhold: ArbeidsforholdFormData,
    søknadsperiode: DateRange
): ArbeidAnsattSøknadsdata => {
    const erAnsatt = arbeidsforhold.erAnsatt === YesOrNo.YES;
    const sluttetFørSøknadsperiode = erAnsatt === false && arbeidsforhold.sluttetFørSøknadsperiode === YesOrNo.YES;

    return {
        erAnsattISøknadsperiode: erAnsatt === true || sluttetFørSøknadsperiode === false,
        arbeidsgiver: arbeidsforhold.arbeidsgiver,
        arbeidsforhold: arbeidsforhold ? extractArbeidsforholdSøknadsdata(arbeidsforhold, søknadsperiode) : undefined,
    };
};
