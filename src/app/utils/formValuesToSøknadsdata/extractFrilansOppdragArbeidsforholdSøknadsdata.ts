import { FrilansoppdragsgivereSøknadsdata } from '../../types/søknadsdata/arbeidFrilansOppdragSøknadsdata';
import { ArbeidsforholdFrilansoppdragFormValues } from '../../types/ArbeidsforholdFormValues';
import { extractArbeidFrilansoppdragSøknadsdata } from './extractArbeidFrilansoppdragSøknadsdata';
import { DateRange } from '@navikt/sif-common-formik/lib';

export const extractFrilansOppdragArbeidsforholdSøknadsdata = (
    oppdragsgivere: ArbeidsforholdFrilansoppdragFormValues[] = [],
    søknadsperiode: DateRange
): FrilansoppdragsgivereSøknadsdata | undefined => {
    const oppdragsgivereSøknadsdataMap: FrilansoppdragsgivereSøknadsdata = new Map();
    oppdragsgivere.forEach((oppdrag) => {
        const oppdragArbeidsforhold = extractArbeidFrilansoppdragSøknadsdata(oppdrag, søknadsperiode);
        if (oppdragArbeidsforhold) {
            oppdragsgivereSøknadsdataMap.set(oppdrag.arbeidsgiver.id, oppdragArbeidsforhold);
        }
    });

    return oppdragsgivereSøknadsdataMap.size > 0 ? oppdragsgivereSøknadsdataMap : undefined;
};
