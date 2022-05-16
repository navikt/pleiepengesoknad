import { DateRange } from '@navikt/sif-common-formik/lib';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger/lib';
import { ArbeidsforholdFormData, ArbeidsforholdFrilanserFormData } from '../../types/ArbeidsforholdFormData';
import { ArbeidsforholdSøknadsdata } from '../../types/søknadsdata/Søknadsdata';
import { extractArbeidIPeriodeSøknadsdata } from './extractArbeidIPeriodeSøknadsdata';
import { extractNormalarbeidstid } from './extractNormalarbeidstidSøknadsdata';

export const extractArbeidsforholdSøknadsdata = (
    arbeidsforhold: ArbeidsforholdFrilanserFormData | ArbeidsforholdFormData,
    søknadsperiode: DateRange,
    arbeidsforholdType: ArbeidsforholdType,
    maksperiode?: DateRange
): ArbeidsforholdSøknadsdata | undefined => {
    const normalarbeidstid = extractNormalarbeidstid(arbeidsforhold.normalarbeidstid, arbeidsforholdType);
    if (normalarbeidstid) {
        const arbeidISøknadsperiode = arbeidsforhold.arbeidIPeriode
            ? extractArbeidIPeriodeSøknadsdata(arbeidsforhold.arbeidIPeriode, søknadsperiode, maksperiode)
            : undefined;

        return {
            normalarbeidstid,
            arbeidISøknadsperiode,
        };
    }
    return undefined;
};
