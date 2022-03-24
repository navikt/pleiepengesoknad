import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { ArbeidsforholdFormData } from '../../types/ArbeidsforholdFormData';
import { SøknadFormData } from '../../types/SøknadFormData';
import { ArbeidsgivereSøknadsdata, ArbeidAnsattSøknadsdata } from '../../types/Søknadsdata';
import { extractArbeidsforholdSøknadsdata } from './extractArbeidsforholdSøknadsdata';

export const extractAnsattArbeidsforholdSøknadsdata = (
    arbeidsforhold: ArbeidsforholdFormData,
    søknadsperiode: DateRange
): ArbeidAnsattSøknadsdata | undefined => {
    const erAnsatt = arbeidsforhold.erAnsatt === YesOrNo.YES;
    const sluttetFørSøknadsperiode = erAnsatt === false && arbeidsforhold.sluttetFørSøknadsperiode === YesOrNo.YES;

    return {
        erAnsattISøknadsperiode: erAnsatt === true || sluttetFørSøknadsperiode === false,
        arbeidsgiver: arbeidsforhold.arbeidsgiver,
        arbeidsforhold: arbeidsforhold ? extractArbeidsforholdSøknadsdata(arbeidsforhold, søknadsperiode) : undefined,
    };
};

export const extractArbeidsgivereArbeidsforholdSøknadsdata = (
    values: SøknadFormData,
    søknadsperiode: DateRange
): ArbeidsgivereSøknadsdata | undefined => {
    if (values.ansatt_arbeidsforhold === undefined) {
        return undefined;
    }
    const arbeidsgivereSøknadsdataMap: ArbeidsgivereSøknadsdata = new Map();
    values.ansatt_arbeidsforhold.forEach((ansattForhold) => {
        const ansattArbeidsforholdSøknadsdata = extractAnsattArbeidsforholdSøknadsdata(ansattForhold, søknadsperiode);
        if (ansattArbeidsforholdSøknadsdata) {
            arbeidsgivereSøknadsdataMap.set(ansattForhold.arbeidsgiver.id, ansattArbeidsforholdSøknadsdata);
        }
    });
    return arbeidsgivereSøknadsdataMap.size > 0 ? arbeidsgivereSøknadsdataMap : undefined;
};
