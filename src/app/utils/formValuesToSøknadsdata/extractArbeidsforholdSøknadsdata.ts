import { DateRange, YesOrNo } from '@navikt/sif-common-formik/lib';
import { ArbeidsforholdFormData, ArbeidsforholdFrilanserFormData } from '../../types/ArbeidsforholdFormData';
import { ArbeidsforholdSøknadsdata } from '../../types/Søknadsdata';
import { isYesOrNoAnswered } from '../../validation/fieldValidations';
import { extractArbeidIPeriodeSøknadsdata } from './extractArbeidIPeriodeSøknadsdata';
import { extractNormalarbeidstid } from './extractNormalarbeidstidSøknadsdata';

export const extractArbeidsforholdSøknadsdata = (
    arbeidsforhold: ArbeidsforholdFrilanserFormData | ArbeidsforholdFormData,
    søknadsperiode: DateRange
): ArbeidsforholdSøknadsdata | undefined => {
    const harFraværIPeriode = isYesOrNoAnswered(arbeidsforhold.harFraværIPeriode)
        ? arbeidsforhold.harFraværIPeriode === YesOrNo.YES
        : undefined;

    const normalarbeidstid = extractNormalarbeidstid(arbeidsforhold.normalarbeidstid);

    if (normalarbeidstid && harFraværIPeriode !== undefined) {
        if (harFraværIPeriode) {
            const arbeidISøknadsperiode = arbeidsforhold.arbeidIPeriode
                ? extractArbeidIPeriodeSøknadsdata(arbeidsforhold.arbeidIPeriode, normalarbeidstid, søknadsperiode)
                : undefined;
            return {
                harFraværIPeriode: true,
                normalarbeidstid,
                arbeidISøknadsperiode,
            };
        }
        if (!harFraværIPeriode) {
            return {
                harFraværIPeriode: false,
                normalarbeidstid,
            };
        }
    }
    return undefined;
};
