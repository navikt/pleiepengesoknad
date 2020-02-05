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
    'pågående' = 'pågående',
    'navnPåNæringen' = 'navnPåNæringen',
    'organisasjonsnummer' = 'organisasjonsnummer',
    'registrertINorge' = 'registrertINorge',
    'registrertILand' = 'registrertILand',
    'stillingsprosent' = 'stillingsprosent',
    'harBlittYrkesaktivILøpetAvDeTreSisteFerdigliknedeÅrene' = 'harBlittYrkesaktivILøpetAvDeTreSisteFerdigliknedeÅrene',
    'oppstartsdato' = 'oppstartsdato',
    'avsluttetdato' = 'avsluttetdato',
    'hattVarigEndringAvNæringsinntektSiste4Kalenderår' = 'hattVarigEndringAvNæringsinntektSiste4Kalenderår',
    'endretNæringsinntektInformasjon' = 'endretNæringsinntektInformasjon',
    'harRegnskapsfører' = 'harRegnskapsfører',
    'regnskapsfører' = 'regnskapsfører',
    'harRevisor' = 'harRevisor',
    'revisor' = 'revisor',
    'kanInnhenteOpplsyningerFraRevisor' = 'kanInnhenteOpplsyningerFraRevisor'
}

export class NæringFormData {
    id?: string;
    [NæringFormField.næringstyper]: Næringstype[];
    [NæringFormField.fom]: Date;
    [NæringFormField.tom]: Date;
    [NæringFormField.næringsinntekt]: number;
    [NæringFormField.pågående]: YesOrNo;
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
    [NæringFormField.regnskapsfører]: Næringsrelasjon;
    [NæringFormField.harRevisor]: YesOrNo;
    [NæringFormField.revisor]: Næringsrelasjon;
    [NæringFormField.kanInnhenteOpplsyningerFraRevisor]: YesOrNo;
}

export class EndretNæringsinntektInformasjon {
    dato: Date;
    næringsinntektEtterEndring: number;
    forklaring: string;
}

export class Næringsrelasjon {
    navn: string;
    telefonnummer: string;
    erNærVennEllerFamilie: YesOrNo;
}
