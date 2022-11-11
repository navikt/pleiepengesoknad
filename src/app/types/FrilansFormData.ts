import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { ISODate } from '@navikt/sif-common-utils/lib';
import { ArbeidsforholdFrilanserFormValues } from './ArbeidsforholdFormValues';

export enum FrilansFormField {
    harHattInntektSomFrilanser = 'frilans.harHattInntektSomFrilanser',
    startdato = 'frilans.startdato',
    sluttdato = 'frilans.sluttdato',
    erFortsattFrilanser = 'frilans.erFortsattFrilanser',
    arbeidsforhold = 'frilans.arbeidsforhold',
}

export enum FrilansOppdragFormField {
    frilansOppdragIPerioden = 'frilansOppdragIPerioden',
    sluttdato = 'sluttdato',
    frilansOppdragKategori = 'frilansOppdragKategori',
    styremedlemHeleInntekt = 'styremedlemHeleInntekt',
    normalarbeidstid = 'normalarbeidstid',
    normalarbeidstid_erLiktSomForrigeSøknad = 'normalarbeidstid.erLiktSomForrigeSøknad',
    normalarbeidstid_TimerPerUke = 'normalarbeidstid.timerPerUke',
    arbeidIPeriode = 'arbeidIPeriode',
}

export enum FrilansNyFormField {
    arbeidsgiver_id = 'arbeidsgiver.id',
    arbeidsgiver_navn = 'arbeidsgiver.navn',
    arbeidsgiver_type = 'arbeidsgiver.type',
    arbeidsgiver_ansattFom = 'arbeidsgiver.ansattFom',
    arbeidsgiver_ansattTom = 'arbeidsgiver.ansattTom',
    sluttet = 'sluttet',
    frilansOppdragKategori = 'frilansOppdragKategori',
    styremedlemHeleInntekt = 'styremedlemHeleInntekt',
    normalarbeidstid = 'normalarbeidstid',
    normalarbeidstid_erLiktSomForrigeSøknad = 'normalarbeidstid.erLiktSomForrigeSøknad',
    normalarbeidstid_TimerPerUke = 'normalarbeidstid.timerPerUke',
    arbeidIPeriode = 'arbeidIPeriode',
}

export interface FrilansFormData {
    harHattInntektSomFrilanser?: YesOrNo;
    erFortsattFrilanser?: YesOrNo;
    startdato?: ISODate;
    sluttdato?: ISODate;
    arbeidsforhold?: ArbeidsforholdFrilanserFormValues;
}

export enum FrilanserOppdragType {
    OMSORGSSTØNAD = 'OMSORGSSTØNAD',
    FRILANSER = 'FRILANSER',
    STYREMEDLEM_ELLER_VERV = 'STYREMEDLEM_ELLER_VERV',
    FOSTERFORELDER = 'FOSTERFORELDER',
}
