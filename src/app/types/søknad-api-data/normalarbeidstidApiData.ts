import { ISODuration } from '@navikt/sif-common-utils/lib';
import { TimerFasteDagerApiData } from './SøknadApiData';

export type NormalarbeidstidSnittPerUkeApiData = {
    erLiktHverUke: false;
    timerPerUkeISnitt: ISODuration;
    _erLiktSnittSomForrigeSøknad?: boolean;
    _arbeiderDeltid?: boolean;
    _arbeiderHelg?: boolean;
};

export type NormalarbeidstidFasteDagerPerUkeApiData = {
    erLiktHverUke: true;
    timerFasteDager: TimerFasteDagerApiData;
    _arbeiderDeltid: false;
    _arbeiderHelg: false;
};

export type NormalarbeidstidApiData = NormalarbeidstidSnittPerUkeApiData | NormalarbeidstidFasteDagerPerUkeApiData;

export const isNormalarbeidstidSnittPerUkeApiData = (
    normalarbeidstid: NormalarbeidstidApiData
): normalarbeidstid is NormalarbeidstidSnittPerUkeApiData => {
    return normalarbeidstid.erLiktHverUke === false;
};
export const isNormalarbeidstidFasteDagerPerUkeApiData = (
    normalarbeidstid: NormalarbeidstidApiData
): normalarbeidstid is NormalarbeidstidFasteDagerPerUkeApiData => {
    return normalarbeidstid.erLiktHverUke === true;
};
