import { DateRange } from '@navikt/sif-common-formik/lib';
import { ArbeidsforholdFormData } from '../../types/ArbeidsforholdFormData';
import { ArbeidsgivereSøknadsdata } from '../../types/søknadsdata/Søknadsdata';
import { extractArbeidAnsattSøknadsdata } from './extractArbeidAnsattSøknadsdata';

export const extractArbeidsgivereArbeidsforholdSøknadsdata = (
    ansatt_arbeidsforhold: ArbeidsforholdFormData[] = [],
    søknadsperiode: DateRange
): ArbeidsgivereSøknadsdata | undefined => {
    const arbeidsgivereSøknadsdataMap: ArbeidsgivereSøknadsdata = new Map();
    ansatt_arbeidsforhold.forEach((ansattForhold) => {
        const ansattArbeidsforhold = extractArbeidAnsattSøknadsdata(ansattForhold, søknadsperiode);
        if (ansattArbeidsforhold) {
            arbeidsgivereSøknadsdataMap.set(ansattForhold.arbeidsgiver.id, ansattArbeidsforhold);
        }
        console.log({ arbeidsgivereSøknadsdataMap, ansattForhold });
    });

    return arbeidsgivereSøknadsdataMap.size > 0 ? arbeidsgivereSøknadsdataMap : undefined;
};
