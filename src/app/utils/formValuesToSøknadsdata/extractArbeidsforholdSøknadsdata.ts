import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger/lib';
import {
    ArbeidsforholdFormValues,
    ArbeidsforholdFrilanserMedOppdragFormValues,
    ArbeidsforholdSelvstendigFormValues,
} from '../../types/ArbeidsforholdFormValues';
import { ArbeidsforholdSøknadsdata } from '../../types/søknadsdata/Søknadsdata';
import { extractArbeidIPeriodeSøknadsdata } from './extractArbeidIPeriodeSøknadsdata';
import { extractNormalarbeidstid } from './extractNormalarbeidstidSøknadsdata';

export const extractArbeidsforholdSøknadsdata = (
    arbeidsforhold:
        | ArbeidsforholdFormValues
        | ArbeidsforholdFrilanserMedOppdragFormValues
        | ArbeidsforholdSelvstendigFormValues,
    arbeidsforholdType: ArbeidsforholdType
): ArbeidsforholdSøknadsdata | undefined => {
    const normalarbeidstid = extractNormalarbeidstid(arbeidsforhold.normalarbeidstid, arbeidsforholdType);

    if (normalarbeidstid) {
        const arbeidISøknadsperiode = arbeidsforhold.arbeidIPeriode
            ? extractArbeidIPeriodeSøknadsdata(arbeidsforhold.arbeidIPeriode)
            : undefined;

        return {
            normalarbeidstid,
            arbeidISøknadsperiode,
        };
    }
    return undefined;
};
