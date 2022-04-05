import { DateRange } from '@navikt/sif-common-formik/lib';
import { ArbeidsforholdFormData, ArbeidsforholdFrilanserFormData } from '../../types/ArbeidsforholdFormData';
import { ArbeidsforholdSøknadsdata } from '../../types/Søknadsdata';
import { extractArbeidIPeriodeSøknadsdata } from './extractArbeidIPeriodeSøknadsdata';
import { extractNormalarbeidstid } from './extractNormalarbeidstidSøknadsdata';

export const extractArbeidsforholdSøknadsdata = (
    arbeidsforhold: ArbeidsforholdFrilanserFormData | ArbeidsforholdFormData,
    søknadsperiode: DateRange
): ArbeidsforholdSøknadsdata | undefined => {
    const normalarbeidstid = extractNormalarbeidstid(arbeidsforhold.normalarbeidstid);
    if (normalarbeidstid) {
        const arbeidISøknadsperiode = arbeidsforhold.arbeidIPeriode
            ? extractArbeidIPeriodeSøknadsdata(arbeidsforhold.arbeidIPeriode, søknadsperiode)
            : undefined;

        return {
            normalarbeidstid,
            arbeidISøknadsperiode,
        };
    }
    return undefined;
};
