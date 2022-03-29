import { DateRange } from '@navikt/sif-common-formik/lib';
import { ArbeidsforholdFormData } from '../../types/ArbeidsforholdFormData';
import { ArbeidsgivereSøknadsdata } from '../../types/Søknadsdata';
import { extractArbeidAnsattSøknadsdata } from './extractArbeidAnsattSøknadsdata';

export const extractArbeidsgivereArbeidsforholdSøknadsdata = (
    ansatt_arbeidsforhold: ArbeidsforholdFormData[] = [],
    søknadsperiode: DateRange
): ArbeidsgivereSøknadsdata | undefined => {
    const arbeidsgivereSøknadsdataMap: ArbeidsgivereSøknadsdata = new Map();
    ansatt_arbeidsforhold.forEach((ansattForhold) => {
        arbeidsgivereSøknadsdataMap.set(
            ansattForhold.arbeidsgiver.id,
            extractArbeidAnsattSøknadsdata(ansattForhold, søknadsperiode)
        );
    });
    return arbeidsgivereSøknadsdataMap.size > 0 ? arbeidsgivereSøknadsdataMap : undefined;
};
