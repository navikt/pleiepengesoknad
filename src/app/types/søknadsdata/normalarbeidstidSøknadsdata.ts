import { DurationWeekdays } from '@navikt/sif-common-utils/lib';

export enum NormalarbeidstidType {
    arbeiderHelg = 'arbeiderHelg',
    likeUkerOgDager = 'likeUkerOgDager',
    likeUkerVarierendeDager = 'likeUkerVarierendeDager',
    ulikeUker = 'ulikeUker',
}
export interface NormalarbeidstidSøknadsdataLikeUker {
    type: NormalarbeidstidType.likeUkerOgDager;
    erLiktHverUke: true;
    erFasteUkedager: true;
    timerFasteUkedager: DurationWeekdays;
}
export interface NormalarbeidstidSøknadsdataLikeUkerVarierendeUkedager {
    type: NormalarbeidstidType.likeUkerVarierendeDager;
    erLiktHverUke: true;
    erFasteUkedager: false;
    timerPerUkeISnitt: number;
}
export interface NormalarbeidstidSøknadsdataUlikeUker {
    type: NormalarbeidstidType.ulikeUker;
    erLiktHverUke: false;
    erFasteUkedager: false;
    timerPerUkeISnitt: number;
}

export interface NormalarbeidstidSøknadsdataArbeiderHelg {
    type: NormalarbeidstidType.arbeiderHelg;
    erLiktHverUke: false;
    erFasteUkedager: false;
    timerPerUkeISnitt: number;
}

export type NormalarbeidstidSøknadsdata =
    | NormalarbeidstidSøknadsdataArbeiderHelg
    | NormalarbeidstidSøknadsdataLikeUker
    | NormalarbeidstidSøknadsdataLikeUkerVarierendeUkedager
    | NormalarbeidstidSøknadsdataUlikeUker;
