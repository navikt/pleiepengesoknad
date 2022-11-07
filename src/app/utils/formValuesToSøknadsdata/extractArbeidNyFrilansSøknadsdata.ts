import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger/lib';
import { FrilansOppdragKategori, YesOrNoRadio } from '../../types/FrilansFormData';
import { ArbeidsforholdFrilanserNyFormValues } from '../../types/ArbeidsforholdFormValues';
import { extractArbeidsforholdSøknadsdata } from './extractArbeidsforholdSøknadsdata';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { DateRange, YesOrNo } from '@navikt/sif-common-formik/lib';
import { getPeriodeSomFrilanserInnenforSøknadsperiode } from '../frilanserUtils';
import { ArbeidNyFrilansSøknadsdata } from '../../types/søknadsdata/arbeidNyFrilansSøknadsdata';

export const extractArbeidNyFrilansSøknadsdata = (
    arbeidsforhold: ArbeidsforholdFrilanserNyFormValues,
    erFrilanserIPeriode: YesOrNo,
    søknadsperiode: DateRange
): ArbeidNyFrilansSøknadsdata | undefined => {
    if (erFrilanserIPeriode === YesOrNo.NO) {
        return {
            type: 'erIkkeFrilanser',
            erFrilanser: false,
        };
    }
    /** Bruker har ikke besvart denne informasjonen enda */
    if (arbeidsforhold.frilansOppdragKategori === undefined) {
        return undefined;
    }

    const startdato = datepickerUtils.getDateFromDateString(arbeidsforhold.startdato);
    const sluttdato = datepickerUtils.getDateFromDateString(arbeidsforhold.sluttdato);
    const utenArbeidsforhold =
        arbeidsforhold.frilansOppdragKategori === FrilansOppdragKategori.FOSTERFORELDER ||
        (arbeidsforhold.frilansOppdragKategori === FrilansOppdragKategori.STYREMEDLEM_ELLER_VERV &&
            arbeidsforhold.styremedlemHeleInntekt === YesOrNoRadio.JA);
    if (utenArbeidsforhold && startdato) {
        return {
            type: 'utenArbeidsforhold',
            id: arbeidsforhold.id,
            navn: arbeidsforhold.navn,
            frilansOppdragKategori: arbeidsforhold.frilansOppdragKategori,
            startdato,
            sluttdato,
            styremedlemHeleInntekt:
                arbeidsforhold.frilansOppdragKategori === FrilansOppdragKategori.STYREMEDLEM_ELLER_VERV
                    ? YesOrNoRadio.JA
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
                id: arbeidsforhold.id,
                navn: arbeidsforhold.navn,
                frilansOppdragKategori: arbeidsforhold.frilansOppdragKategori,
                startdato,
                sluttdato,
                aktivPeriode,
                arbeidsforhold: arbeidsforholdSøknadsdata,
                styremedlemHeleInntekt:
                    arbeidsforhold.frilansOppdragKategori === FrilansOppdragKategori.STYREMEDLEM_ELLER_VERV
                        ? YesOrNoRadio.NEI
                        : undefined,
            };
        }
        if (sluttdato === undefined && startdato && aktivPeriode) {
            return {
                type: 'pågående',
                id: arbeidsforhold.id,
                navn: arbeidsforhold.navn,
                startdato,
                frilansOppdragKategori: arbeidsforhold.frilansOppdragKategori,
                aktivPeriode,
                arbeidsforhold: arbeidsforholdSøknadsdata,
                styremedlemHeleInntekt:
                    arbeidsforhold.frilansOppdragKategori === FrilansOppdragKategori.STYREMEDLEM_ELLER_VERV
                        ? YesOrNoRadio.NEI
                        : undefined,
            };
        }
    }

    return undefined;
};
