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
    id = 'id',
    navn = 'navn',
    startdato = 'startdato',
    sluttet = 'sluttet',
    sluttdato = 'sluttdato',
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

export enum FrilansOppdragSvar {
    JA = 'yes',
    JAAVSLUTESIPERIODEN = 'yesAvsluttesIPerioden',
    NEI = 'no',
}

export enum FrilansOppdragKategori {
    OMSORGSSTØNAD = 'Omsorgsstønad',
    FRILANSER = 'Frilanser',
    STYREMEDLEM_ELLER_VERV = 'StyremedlemEllerVerv',
    FOSTERFORELDER = 'Fosterforelder',
}

export enum YesOrNoRadio {
    JA = 'yes',
    NEI = 'no',
}
