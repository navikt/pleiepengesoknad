import { ArbeiderIPeriodenSvar } from '@navikt/sif-common-pleiepenger/lib';
import { ISODate, ISODuration } from '@navikt/sif-common-utils/lib';
import { ArbeidIPeriodeType } from '../søknadsdata/arbeidIPeriodeSøknadsdata';
import { TimerFasteDagerApiData } from './SøknadApiData';

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

export interface ArbeidIPeriodeApiDataFasteDager {
    type: ArbeidIPeriodeType.arbeiderFasteUkedager;
    arbeiderIPerioden: ArbeiderIPeriodenSvar.redusert;
    erLiktHverUke: true;
    fasteDager: TimerFasteDagerApiData;
}

export interface ArbeidIPeriodeApiDataProsent {
    type: ArbeidIPeriodeType.arbeiderProsentAvNormalt;
    arbeiderIPerioden: ArbeiderIPeriodenSvar.redusert;
    prosentAvNormalt: number;
}

export interface ArbeidIPeriodeApiDataTimerPerUke {
    type: ArbeidIPeriodeType.arbeiderTimerISnittPerUke;
    arbeiderIPerioden: ArbeiderIPeriodenSvar.redusert;
    timerPerUke: ISODuration;
}

export interface ArbeidIPeriodeApiDataVariert {
    type: ArbeidIPeriodeType.arbeiderEnkeltdager;
    arbeiderIPerioden: ArbeiderIPeriodenSvar.redusert;
    enkeltdager: ArbeidstidEnkeltdagApiData[];
}

export type ArbeidIPeriodeApiData =
    | ArbeidIPeriodeApiDataJobberIkke
    | ArbeidIPeriodeApiDataJobberVanlig
    | ArbeidIPeriodeApiDataFasteDager
    | ArbeidIPeriodeApiDataProsent
    | ArbeidIPeriodeApiDataTimerPerUke
    | ArbeidIPeriodeApiDataVariert;
