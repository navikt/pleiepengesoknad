import { YesOrNo } from 'common/types/YesOrNo';

export enum Næringstype {
    'FISKER' = 'FISKE',
    'JORDBRUK' = 'JORDBRUK_SKOGBRUK',
    'DAGMAMMA' = 'DAGMAMMA',
    'ANNET' = 'ANNEN'
}

export class NæringFormData {
    id?: string;
    næringstyper: Næringstype[];
    fom: Date;
    tom: Date;
    næringsinntekt: number;
    pågående: YesOrNo;
    navnPåNæringen: string;
    organisasjonsnummer: string;
    registrertINorge: YesOrNo;
    registrertILand: string;
    stillingsprosent: string;
    harBlittYrkesaktivILøpetAvDeTreSisteFerdigliknedeÅrene?: YesOrNo;
    oppstartsdato?: Date;
    hattVarigEndringAvNæringsinntektSiste4Kalenderår?: YesOrNo;
    endretNæringsinntektInformasjon?: EndretNæringsinntektInformasjon;
    harRegnskapsfører: YesOrNo;
    regnskapsfører: Næringsrelasjon;
    harRevisor: boolean;
    revisor: Næringsrelasjon;
    kanInnhenteOpplsyningerFraRevisor: boolean;
}

export class EndretNæringsinntektInformasjon {
    dato: Date;
    næringsinntektEtterEndring: number;
    forklaring: string;
}

export class Næringsrelasjon {
    navn: string;
    telefonnummer: string;
    erNærVennEllerFamilie: boolean;
}
