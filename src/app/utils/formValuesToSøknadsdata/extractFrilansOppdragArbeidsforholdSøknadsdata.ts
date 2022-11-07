import { OppdragsgivereSøknadsdata } from '../../types/søknadsdata/arbeidFrilansOppdragSøknadsdata';
import { ArbeidsforholdFrilanserMedOppdragFormValues } from '../../types/ArbeidsforholdFormValues';
import { extractArbeidFrilansOppdragSøknadsdata } from './extractArbeidFrilansOppdragSøknadsdata';
import { DateRange } from '@navikt/sif-common-formik/lib';

export const extractFrilansOppdragArbeidsforholdSøknadsdata = (
    oppdragsgivere: ArbeidsforholdFrilanserMedOppdragFormValues[] = [],
    søknadsperiode: DateRange
): OppdragsgivereSøknadsdata | undefined => {
    const oppdragsgivereSøknadsdataMap: OppdragsgivereSøknadsdata = new Map();
    oppdragsgivere.forEach((oppdrag) => {
        const oppdragArbeidsforhold = extractArbeidFrilansOppdragSøknadsdata(oppdrag, søknadsperiode);
        if (oppdragArbeidsforhold) {
            oppdragsgivereSøknadsdataMap.set(oppdrag.arbeidsgiver.id, oppdragArbeidsforhold);
        }
    });

    return oppdragsgivereSøknadsdataMap.size > 0 ? oppdragsgivereSøknadsdataMap : undefined;
};
