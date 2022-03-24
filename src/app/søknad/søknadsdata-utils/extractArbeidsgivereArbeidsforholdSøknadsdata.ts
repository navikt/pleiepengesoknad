import { ArbeidsforholdFormData } from '../../types/ArbeidsforholdFormData';
import { SøknadFormData } from '../../types/SøknadFormData';
import { ArbeidsgivereArbeidssituasjonSøknadsdata, ArbeidssituasjonAnsattSøknadsdata } from '../../types/Søknadsdata';
import { extractArbeidsforholdSøknadsdata } from './extractArbeidsforholdSøknadsdata';

export const extractAnsattArbeidsforholdSøknadsdata = (
    arbeidsforhold: ArbeidsforholdFormData
): ArbeidssituasjonAnsattSøknadsdata | undefined => {
    if (arbeidsforhold === undefined) {
        return undefined;
    }
    return {
        arbeidsgiver: arbeidsforhold.arbeidsgiver,
        arbeidsforhold: extractArbeidsforholdSøknadsdata(arbeidsforhold),
    };
};

export const extractArbeidsgivereArbeidsforholdSøknadsdata = (
    values: SøknadFormData
): ArbeidsgivereArbeidssituasjonSøknadsdata | undefined => {
    if (values.ansatt_arbeidsforhold === undefined) {
        return undefined;
    }
    const arbeidsgivereSøknadsdataMap: ArbeidsgivereArbeidssituasjonSøknadsdata = new Map();
    values.ansatt_arbeidsforhold.forEach((ansattForhold) => {
        const ansattArbeidsforholdSøknadsdata = extractAnsattArbeidsforholdSøknadsdata(ansattForhold);
        if (ansattArbeidsforholdSøknadsdata) {
            arbeidsgivereSøknadsdataMap.set(ansattForhold.arbeidsgiver.id, ansattArbeidsforholdSøknadsdata);
        }
    });
    return arbeidsgivereSøknadsdataMap.size > 0 ? arbeidsgivereSøknadsdataMap : undefined;
};
