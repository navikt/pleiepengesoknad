import { ArbeiderIPeriodenSvar } from '@navikt/sif-common-pleiepenger/lib';
import { ISODate, ISODuration } from '@navikt/sif-common-utils/lib';
import { ArbeidIPeriodeType } from '../arbeidIPeriodeType';

export interface ArbeidstimerApiData {
    normalTimer: ISODuration;
    faktiskTimer: ISODuration;
}

export interface ArbeidstidEnkeltdagApiData {
    dato: ISODate;
    arbeidstimer: ArbeidstimerApiData;
}

export interface ArbeidIPeriodeApiDataJobberIkke {
    type: ArbeidIPeriodeType.arbeiderIkke;
    arbeiderIPerioden: ArbeiderIPeriodenSvar.heltFravær;
}

export interface ArbeidIPeriodeApiDataJobberVanlig {
    type: ArbeidIPeriodeType.arbeiderVanlig;
    arbeiderIPerioden: ArbeiderIPeriodenSvar.somVanlig;
}

export interface ArbeidIPeriodeApiDataProsent {
    type: ArbeidIPeriodeType.arbeiderProsentAvNormalt;
    arbeiderIPerioden: ArbeiderIPeriodenSvar.redusert;
    prosentAvNormalt: number;
}

export interface ArbeidIPeriodeApiDataTimerPerUke {
    type: ArbeidIPeriodeType.arbeiderTimerISnittPerUke;
    arbeiderIPerioden: ArbeiderIPeriodenSvar.redusert;
    snittTimerPerUke: ISODuration;
}

export type ArbeidIPeriodeApiData =
    | ArbeidIPeriodeApiDataJobberIkke
    | ArbeidIPeriodeApiDataJobberVanlig
    | ArbeidIPeriodeApiDataProsent
    | ArbeidIPeriodeApiDataTimerPerUke;
