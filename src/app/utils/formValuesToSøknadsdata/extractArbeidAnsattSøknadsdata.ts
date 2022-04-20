import { DateRange, YesOrNo } from '@navikt/sif-common-formik/lib';
import { ArbeidsforholdFormData } from '../../types/ArbeidsforholdFormData';
import { ArbeidAnsattSøknadsdata } from '../../types/søknadsdata/Søknadsdata';
import { extractArbeidsforholdSøknadsdata } from './extractArbeidsforholdSøknadsdata';

export const extractArbeidAnsattSøknadsdata = (
    arbeidsforhold: ArbeidsforholdFormData,
    søknadsperiode: DateRange
): ArbeidAnsattSøknadsdata | undefined => {
    /** Bruker har ikke besvart denne informasjonen enda */
    if (arbeidsforhold.erAnsatt === undefined) {
        return undefined;
    }
    const erAnsatt = arbeidsforhold.erAnsatt === YesOrNo.YES;
    const sluttetFørSøknadsperiode = erAnsatt === false && arbeidsforhold.sluttetFørSøknadsperiode === YesOrNo.YES;

    if (sluttetFørSøknadsperiode) {
        return {
            type: 'sluttetFørSøknadsperiode',
            erAnsattISøknadsperiode: false,
            arbeidsgiver: arbeidsforhold.arbeidsgiver,
        };
    }
    const arbeidsforholdSøknadsdata = extractArbeidsforholdSøknadsdata(arbeidsforhold, søknadsperiode);
    if (arbeidsforholdSøknadsdata) {
        if (erAnsatt === false && sluttetFørSøknadsperiode === false) {
            return {
                type: 'sluttetISøknadsperiode',
                erAnsattISøknadsperiode: true,
                arbeidsgiver: arbeidsforhold.arbeidsgiver,
                arbeidsforhold: arbeidsforholdSøknadsdata,
            };
        }
        return {
            type: 'pågående',
            erAnsattISøknadsperiode: true,
            arbeidsgiver: arbeidsforhold.arbeidsgiver,
            arbeidsforhold: arbeidsforholdSøknadsdata,
        };
    }
    return undefined;
};
