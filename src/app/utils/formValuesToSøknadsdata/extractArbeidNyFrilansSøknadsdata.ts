import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger/lib';
import { FrilanserOppdragType } from '../../types/FrilansFormData';
import { ArbeidsforholdFrilanserMedOppdragFormValues } from '../../types/ArbeidsforholdFormValues';
import { extractArbeidsforholdSøknadsdata } from './extractArbeidsforholdSøknadsdata';
import { DateRange, YesOrNo } from '@navikt/sif-common-formik/lib';
import { getPeriodeSomFrilanserInnenforSøknadsperiode } from '../frilanserUtils';
import { ArbeidNyFrilansSøknadsdata } from '../../types/søknadsdata/arbeidNyFrilansSøknadsdata';

export const extractArbeidNyFrilansSøknadsdata = (
    arbeidsforhold: ArbeidsforholdFrilanserMedOppdragFormValues,
    erFrilanserIPeriode: YesOrNo,
    søknadsperiode: DateRange
): ArbeidNyFrilansSøknadsdata | undefined => {
    if (erFrilanserIPeriode === YesOrNo.NO) {
        return undefined;
    }

    /** Bruker har ikke besvart denne informasjonen enda */
    if (arbeidsforhold.frilansOppdragKategori === undefined) {
        return undefined;
    }

    const startdato = arbeidsforhold.arbeidsgiver.ansattFom;
    const sluttdato = arbeidsforhold.arbeidsgiver.ansattTom;
    const utenArbeidsforhold =
        arbeidsforhold.frilansOppdragKategori === FrilanserOppdragType.FOSTERFORELDER ||
        (arbeidsforhold.frilansOppdragKategori === FrilanserOppdragType.STYREMEDLEM_ELLER_VERV &&
            arbeidsforhold.styremedlemHeleInntekt === YesOrNo.YES);
    if (utenArbeidsforhold && startdato) {
        return {
            type: 'utenArbeidsforhold',
            arbeidsgiver: arbeidsforhold.arbeidsgiver,
            frilansOppdragKategori: arbeidsforhold.frilansOppdragKategori,
            styremedlemHeleInntekt:
                arbeidsforhold.frilansOppdragKategori === FrilanserOppdragType.STYREMEDLEM_ELLER_VERV
                    ? true
                    : undefined,
        };
    }
    const aktivPeriode = startdato
        ? getPeriodeSomFrilanserInnenforSøknadsperiode(søknadsperiode, startdato, sluttdato)
        : undefined;

    const arbeidsforholdSøknadsdata = extractArbeidsforholdSøknadsdata(arbeidsforhold, ArbeidsforholdType.FRILANSER);
    if (arbeidsforholdSøknadsdata) {
        if (startdato && sluttdato && aktivPeriode) {
            return {
                type: 'sluttetISøknadsperiode',
                arbeidsgiver: arbeidsforhold.arbeidsgiver,
                frilansOppdragKategori: arbeidsforhold.frilansOppdragKategori,
                aktivPeriode,
                arbeidsforhold: arbeidsforholdSøknadsdata,
                styremedlemHeleInntekt:
                    arbeidsforhold.frilansOppdragKategori === FrilanserOppdragType.STYREMEDLEM_ELLER_VERV
                        ? false
                        : undefined,
            };
        }
        if (sluttdato === undefined && startdato && aktivPeriode) {
            return {
                type: 'pågående',
                arbeidsgiver: arbeidsforhold.arbeidsgiver,
                frilansOppdragKategori: arbeidsforhold.frilansOppdragKategori,
                aktivPeriode,
                arbeidsforhold: arbeidsforholdSøknadsdata,
                styremedlemHeleInntekt:
                    arbeidsforhold.frilansOppdragKategori === FrilanserOppdragType.STYREMEDLEM_ELLER_VERV
                        ? false
                        : undefined,
            };
        }
    }

    return undefined;
};
