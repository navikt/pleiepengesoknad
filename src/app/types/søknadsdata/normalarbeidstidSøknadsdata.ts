import { DurationWeekdays } from '@navikt/sif-common-utils/lib';

export enum NormalarbeidstidType {
    likeUkerOgDager = 'likeUkerOgDager',
    likeUkerVarierendeDager = 'likeUkerVarierendeDager',
    varierendeUker = 'varierendeUker',
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
    type: NormalarbeidstidType.varierendeUker;
    erLiktHverUke: false;
    erFasteUkedager: false;
    timerPerUkeISnitt: number;
}

export type NormalarbeidstidSøknadsdata =
    | NormalarbeidstidSøknadsdataLikeUker
    | NormalarbeidstidSøknadsdataLikeUkerVarierendeUkedager
    | NormalarbeidstidSøknadsdataUlikeUker;
