import { YesOrNo } from 'common/types/YesOrNo';

export enum Næringstype {
    'FISKER' = 'FISKE',
    'JORDBRUK' = 'JORDBRUK_SKOGBRUK',
    'DAGMAMMA' = 'DAGMAMMA',
    'ANNET' = 'ANNEN'
}

export enum NæringFormField {
    'næringstyper' = 'næringstyper',
    'fom' = 'fom',
    'tom' = 'tom',
    'næringsinntekt' = 'næringsinntekt',
    'erPågående' = 'erPågående',
    'navnPåNæringen' = 'navnPåNæringen',
    'organisasjonsnummer' = 'organisasjonsnummer',
    'registrertINorge' = 'registrertINorge',
    'registrertILand' = 'registrertILand',
    'stillingsprosent' = 'stillingsprosent',
    'harBlittYrkesaktivILøpetAvDeTreSisteFerdigliknedeÅrene' = 'harBlittYrkesaktivILøpetAvDeTreSisteFerdigliknedeÅrene',
    'oppstartsdato' = 'oppstartsdato',
    'hattVarigEndringAvNæringsinntektSiste4Kalenderår' = 'hattVarigEndringAvNæringsinntektSiste4Kalenderår',
    'varigEndringINæringsinntekt_dato' = 'varigEndringINæringsinntekt_dato',
    'varigEndringINæringsinntekt_inntektEtterEndring' = 'varigEndringINæringsinntekt_inntektEtterEndring',
    'varigEndringINæringsinntekt_forklaring' = 'varigEndringINæringsinntekt_forklaring',
    'endretNæringsinntektInformasjon' = 'endretNæringsinntektInformasjon',
    'harRegnskapsfører' = 'harRegnskapsfører',
    'regnskapsfører' = 'regnskapsfører',
    'regnskapsfører_navn' = 'regnskapsfører_navn',
    'regnskapsfører_telefon' = 'regnskapsfører_telefon',
    'regnskapsfører_erNærVennEllerFamilie' = 'regnskapsfører_erNærVennEllerFamilie',
    'harRevisor' = 'harRevisor',
    'revisor_navn' = 'revisor_navn',
    'revisor_telefon' = 'revisor_telefon',
    'revisor_erNærVennEllerFamilie' = 'revisor_erNærVennEllerFamilie',
    'kanInnhenteOpplsyningerFraRevisor' = 'kanInnhenteOpplsyningerFraRevisor'
}

export class NæringFormData {
    id?: string;
    [NæringFormField.næringstyper]: Næringstype[];
    [NæringFormField.fom]: Date;
    [NæringFormField.tom]: Date;
    [NæringFormField.næringsinntekt]: number;
    [NæringFormField.erPågående]: boolean;
    [NæringFormField.navnPåNæringen]: string;
    [NæringFormField.organisasjonsnummer]: string;
    [NæringFormField.registrertINorge]: YesOrNo;
    [NæringFormField.registrertILand]: string;
    [NæringFormField.stillingsprosent]: string;
    [NæringFormField.harBlittYrkesaktivILøpetAvDeTreSisteFerdigliknedeÅrene]?: YesOrNo;
    [NæringFormField.oppstartsdato]?: Date;
    [NæringFormField.hattVarigEndringAvNæringsinntektSiste4Kalenderår]?: YesOrNo;
    [NæringFormField.endretNæringsinntektInformasjon]?: EndretNæringsinntektInformasjon;
    [NæringFormField.harRegnskapsfører]: YesOrNo;
    [NæringFormField.regnskapsfører_navn]?: string;
    [NæringFormField.regnskapsfører_telefon]?: string;
    [NæringFormField.regnskapsfører_erNærVennEllerFamilie]?: YesOrNo;
    [NæringFormField.harRevisor]: YesOrNo;
    [NæringFormField.revisor_navn]?: string;
    [NæringFormField.revisor_telefon]?: string;
    [NæringFormField.revisor_erNærVennEllerFamilie]?: YesOrNo;
    [NæringFormField.kanInnhenteOpplsyningerFraRevisor]: YesOrNo;
}

export interface EndretNæringsinntektInformasjon {
    dato: Date;
    næringsinntektEtterEndring: number;
    forklaring: string;
}
