import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger/lib';
import { FrilansoppdragType } from '../../types/FrilansoppdragFormData';
import { ArbeidsforholdFrilansoppdragFormValues } from '../../types/ArbeidsforholdFormValues';
import { extractArbeidsforholdSøknadsdata } from './extractArbeidsforholdSøknadsdata';
import { ArbeidFrilansOppdragSøknadsdata } from '../../types/søknadsdata/arbeidFrilansOppdragSøknadsdata';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { DateRange, YesOrNo } from '@navikt/sif-common-formik/lib';
import { getPeriodeSomFrilanserInnenforSøknadsperiode } from '../frilanserUtils';
import { FrilansoppdragIPeriodenApi } from '../../types/søknad-api-data/frilansoppdragApiDat';

export const extractArbeidFrilansoppdragSøknadsdataa = (
    arbeidsforhold: ArbeidsforholdFrilansoppdragFormValues,
    søknadsperiode: DateRange
): ArbeidFrilansOppdragSøknadsdata | undefined => {
    /** Bruker har ikke besvart denne informasjonen enda */
    if (arbeidsforhold.frilansoppdragIPerioden === undefined) {
        return undefined;
    }

    if (arbeidsforhold.frilansoppdragIPerioden === FrilansoppdragIPeriodenApi.NEI) {
        return {
            type: 'sluttetFørSøknadsperiode',
            arbeidsgiver: arbeidsforhold.arbeidsgiver,
        };
    }

    if (arbeidsforhold.frilansoppdragKategori === undefined) {
        return undefined;
    }
    const startdato = arbeidsforhold.arbeidsgiver.ansattFom;
    const sluttdato = datepickerUtils.getDateFromDateString(arbeidsforhold.sluttdato);

    if (
        arbeidsforhold.frilansoppdragKategori === FrilansoppdragType.FOSTERFORELDER ||
        (arbeidsforhold.frilansoppdragKategori === FrilansoppdragType.STYREMEDLEM_ELLER_VERV &&
            arbeidsforhold.styremedlemHeleInntekt === YesOrNo.YES)
    ) {
        return {
            type: 'utenArbeidsforhold',
            harOppdragIPerioden: arbeidsforhold.frilansoppdragIPerioden,
            frilansoppdragKategori: arbeidsforhold.frilansoppdragKategori,
            styremedlemHeleInntekt:
                arbeidsforhold.frilansoppdragKategori === FrilansoppdragType.STYREMEDLEM_ELLER_VERV ? true : undefined,
            arbeidsgiver: arbeidsforhold.arbeidsgiver,
        };
    }

    const aktivPeriode = startdato
        ? getPeriodeSomFrilanserInnenforSøknadsperiode(søknadsperiode, { from: startdato, to: sluttdato })
        : undefined;
    const arbeidsforholdSøknadsdata = extractArbeidsforholdSøknadsdata(arbeidsforhold, ArbeidsforholdType.FRILANSER);
    if (arbeidsforholdSøknadsdata) {
        if (
            arbeidsforhold.frilansoppdragIPerioden === FrilansoppdragIPeriodenApi.JA_MEN_AVSLUTTES_I_PERIODEN &&
            sluttdato &&
            aktivPeriode
        ) {
            return {
                type: 'sluttetISøknadsperiode',
                harOppdragIPerioden: arbeidsforhold.frilansoppdragIPerioden,
                frilansoppdragKategori: arbeidsforhold.frilansoppdragKategori,
                aktivPeriode,
                arbeidsgiver: arbeidsforhold.arbeidsgiver,
                arbeidsforhold: arbeidsforholdSøknadsdata,
                styremedlemHeleInntekt:
                    arbeidsforhold.frilansoppdragKategori === FrilansoppdragType.STYREMEDLEM_ELLER_VERV
                        ? false
                        : undefined,
            };
        }
        if (arbeidsforhold.frilansoppdragIPerioden === FrilansoppdragIPeriodenApi.JA && aktivPeriode) {
            return {
                type: 'pågående',
                harOppdragIPerioden: arbeidsforhold.frilansoppdragIPerioden,
                frilansoppdragKategori: arbeidsforhold.frilansoppdragKategori,
                aktivPeriode,
                arbeidsgiver: arbeidsforhold.arbeidsgiver,
                arbeidsforhold: arbeidsforholdSøknadsdata,
                styremedlemHeleInntekt:
                    arbeidsforhold.frilansoppdragKategori === FrilansoppdragType.STYREMEDLEM_ELLER_VERV
                        ? false
                        : undefined,
            };
        }
    }
    return undefined;
};
