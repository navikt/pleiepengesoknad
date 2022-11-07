import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger/lib';
import { FrilansOppdragKategori, FrilansOppdragSvar, YesOrNoRadio } from '../../types/FrilansFormData';
import { ArbeidsforholdFrilanserMedOppdragFormValues } from '../../types/ArbeidsforholdFormValues';
import { extractArbeidsforholdSøknadsdata } from './extractArbeidsforholdSøknadsdata';
import { ArbeidFrilansOppdragSøknadsdata } from '../../types/søknadsdata/arbeidFrilansOppdragSøknadsdata';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { getPeriodeSomFrilanserInnenforSøknadsperiode } from '../frilanserUtils';

export const extractArbeidFrilansOppdragSøknadsdata = (
    arbeidsforhold: ArbeidsforholdFrilanserMedOppdragFormValues,
    søknadsperiode: DateRange
): ArbeidFrilansOppdragSøknadsdata | undefined => {
    /** Bruker har ikke besvart denne informasjonen enda */
    if (arbeidsforhold.frilansOppdragIPerioden === undefined) {
        return undefined;
    }
    if (arbeidsforhold.frilansOppdragKategori === undefined) {
        return undefined;
    }

    if (arbeidsforhold.frilansOppdragIPerioden === FrilansOppdragSvar.NEI) {
        return {
            type: 'sluttetFørSøknadsperiode',
            arbeidsgiver: arbeidsforhold.arbeidsgiver,
        };
    }

    const startdato = arbeidsforhold.arbeidsgiver.ansattFom;
    const sluttdato = datepickerUtils.getDateFromDateString(arbeidsforhold.sluttdato);

    if (
        arbeidsforhold.frilansOppdragKategori === FrilansOppdragKategori.FOSTERFORELDER ||
        (arbeidsforhold.frilansOppdragKategori === FrilansOppdragKategori.STYREMEDLEM_ELLER_VERV &&
            arbeidsforhold.styremedlemHeleInntekt === YesOrNoRadio.JA)
    ) {
        return {
            type: 'utenArbeidsForhold',
            frilansOppdragKategori: arbeidsforhold.frilansOppdragKategori,
            sluttdato: sluttdato,
            styremedlemHeleInntekt:
                arbeidsforhold.frilansOppdragKategori === FrilansOppdragKategori.STYREMEDLEM_ELLER_VERV
                    ? YesOrNoRadio.JA
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
            arbeidsforhold.frilansOppdragIPerioden === FrilansOppdragSvar.JAAVSLUTESIPERIODEN &&
            sluttdato &&
            aktivPeriode
        ) {
            return {
                type: 'sluttetISøknadsperiode',
                frilansOppdragKategori: arbeidsforhold.frilansOppdragKategori,
                sluttdato,
                aktivPeriode,
                arbeidsgiver: arbeidsforhold.arbeidsgiver,
                arbeidsforhold: arbeidsforholdSøknadsdata,
                styremedlemHeleInntekt:
                    arbeidsforhold.frilansOppdragKategori === FrilansOppdragKategori.STYREMEDLEM_ELLER_VERV
                        ? YesOrNoRadio.NEI
                        : undefined,
            };
        }
        if (arbeidsforhold.frilansOppdragIPerioden === FrilansOppdragSvar.JA && aktivPeriode) {
            return {
                type: 'pågående',
                frilansOppdragKategori: arbeidsforhold.frilansOppdragKategori,
                aktivPeriode,
                arbeidsgiver: arbeidsforhold.arbeidsgiver,
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
