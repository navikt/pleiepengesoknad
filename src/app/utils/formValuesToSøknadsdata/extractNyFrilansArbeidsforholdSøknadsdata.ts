import { ArbeidsforholdFrilanserNyFormValues } from '../../types/ArbeidsforholdFormValues';
import { DateRange, YesOrNo } from '@navikt/sif-common-formik/lib';
import { extractArbeidNyFrilansSøknadsdata } from './extractArbeidNyFrilansSøknadsdata';
import { FrilansereSøknadsdata } from 'app/types/søknadsdata/arbeidNyFrilansSøknadsdata';

export const extractNyFrilansArbeidsforholdSøknadsdata = (
    frilansere: ArbeidsforholdFrilanserNyFormValues[] = [],
    erFrilanserIPeriode: YesOrNo,
    søknadsperiode: DateRange
): FrilansereSøknadsdata | undefined => {
    const frilansereSøknadsdataMap: FrilansereSøknadsdata = new Map();
    frilansere.forEach((oppdrag) => {
        const oppdragArbeidsforhold = extractArbeidNyFrilansSøknadsdata(oppdrag, erFrilanserIPeriode, søknadsperiode);
        if (oppdragArbeidsforhold) {
            frilansereSøknadsdataMap.set(oppdrag.id, oppdragArbeidsforhold);
        }
    });

    return frilansereSøknadsdataMap.size > 0 ? frilansereSøknadsdataMap : undefined;
};
