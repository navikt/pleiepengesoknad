import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger/lib';
import { FrilanserOppdragType } from '../../types/FrilansFormData';
import { ArbeidsforholdFrilanserMedOppdragFormValues } from '../../types/ArbeidsforholdFormValues';
import { extractArbeidsforholdSøknadsdata } from './extractArbeidsforholdSøknadsdata';
import { ArbeidFrilansOppdragSøknadsdata } from '../../types/søknadsdata/arbeidFrilansOppdragSøknadsdata';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { DateRange, YesOrNo } from '@navikt/sif-common-formik/lib';
import { getPeriodeSomFrilanserInnenforSøknadsperiode } from '../frilanserUtils';
import { FrilanserOppdragIPeriodenApi } from '../../types/søknad-api-data/frilansOppdragApiData';

export const extractArbeidFrilansOppdragSøknadsdata = (
    arbeidsforhold: ArbeidsforholdFrilanserMedOppdragFormValues,
    søknadsperiode: DateRange
): ArbeidFrilansOppdragSøknadsdata | undefined => {
    /** Bruker har ikke besvart denne informasjonen enda */
    if (arbeidsforhold.frilansOppdragIPerioden === undefined) {
        return undefined;
    }

    if (arbeidsforhold.frilansOppdragIPerioden === FrilanserOppdragIPeriodenApi.NEI) {
        return {
            type: 'sluttetFørSøknadsperiode',
            arbeidsgiver: arbeidsforhold.arbeidsgiver,
        };
    }

    if (arbeidsforhold.frilansOppdragKategori === undefined) {
        return undefined;
    }
    const startdato = arbeidsforhold.arbeidsgiver.ansattFom;
    const sluttdato = datepickerUtils.getDateFromDateString(arbeidsforhold.sluttdato);

    if (
        arbeidsforhold.frilansOppdragKategori === FrilanserOppdragType.FOSTERFORELDER ||
        (arbeidsforhold.frilansOppdragKategori === FrilanserOppdragType.STYREMEDLEM_ELLER_VERV &&
            arbeidsforhold.styremedlemHeleInntekt === YesOrNo.YES)
    ) {
        return {
            type: 'utenArbeidsforhold',
            harOppdragIPerioden: arbeidsforhold.frilansOppdragIPerioden,
            frilansOppdragKategori: arbeidsforhold.frilansOppdragKategori,
            styremedlemHeleInntekt:
                arbeidsforhold.frilansOppdragKategori === FrilanserOppdragType.STYREMEDLEM_ELLER_VERV
                    ? true
                    : undefined,
            arbeidsgiver: arbeidsforhold.arbeidsgiver,
        };
    }

    const aktivPeriode = startdato
        ? getPeriodeSomFrilanserInnenforSøknadsperiode(søknadsperiode, startdato, sluttdato)
        : undefined;
    const arbeidsforholdSøknadsdata = extractArbeidsforholdSøknadsdata(arbeidsforhold, ArbeidsforholdType.FRILANSER);
    if (arbeidsforholdSøknadsdata) {
        if (
            arbeidsforhold.frilansOppdragIPerioden === FrilanserOppdragIPeriodenApi.JA_MEN_AVSLUTTES_I_PERIODEN &&
            sluttdato &&
            aktivPeriode
        ) {
            return {
                type: 'sluttetISøknadsperiode',
                harOppdragIPerioden: arbeidsforhold.frilansOppdragIPerioden,
                frilansOppdragKategori: arbeidsforhold.frilansOppdragKategori,
                aktivPeriode,
                arbeidsgiver: arbeidsforhold.arbeidsgiver,
                arbeidsforhold: arbeidsforholdSøknadsdata,
                styremedlemHeleInntekt:
                    arbeidsforhold.frilansOppdragKategori === FrilanserOppdragType.STYREMEDLEM_ELLER_VERV
                        ? false
                        : undefined,
            };
        }
        if (arbeidsforhold.frilansOppdragIPerioden === FrilanserOppdragIPeriodenApi.JA && aktivPeriode) {
            return {
                type: 'pågående',
                harOppdragIPerioden: arbeidsforhold.frilansOppdragIPerioden,
                frilansOppdragKategori: arbeidsforhold.frilansOppdragKategori,
                aktivPeriode,
                arbeidsgiver: arbeidsforhold.arbeidsgiver,
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
