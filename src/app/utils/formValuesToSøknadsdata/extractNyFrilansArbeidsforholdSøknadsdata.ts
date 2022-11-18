import { ArbeidsforholdFrilansoppdragFormValues } from '../../types/ArbeidsforholdFormValues';
import { DateRange, YesOrNo } from '@navikt/sif-common-formik/lib';
import { extractArbeidNyFrilansSøknadsdata } from './extractArbeidNyFrilansSøknadsdata';
import { FrilansereSøknadsdata } from '../../types/søknadsdata/arbeidNyFrilansSøknadsdata';

export const extractNyFrilansArbeidsforholdSøknadsdata = (
    frilansere: ArbeidsforholdFrilansoppdragFormValues[] = [],
    erFrilanserIPeriode: YesOrNo,
    søknadsperiode: DateRange
): FrilansereSøknadsdata | undefined => {
    const frilansereSøknadsdataMap: FrilansereSøknadsdata = new Map();
    frilansere.forEach((oppdrag) => {
        const oppdragArbeidsforhold = extractArbeidNyFrilansSøknadsdata(oppdrag, erFrilanserIPeriode, søknadsperiode);
        if (oppdragArbeidsforhold) {
            frilansereSøknadsdataMap.set(oppdrag.arbeidsgiver.id, oppdragArbeidsforhold);
        }
    });

    return frilansereSøknadsdataMap.size > 0 ? frilansereSøknadsdataMap : undefined;
};
