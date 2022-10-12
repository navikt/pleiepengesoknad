import { ArbeidIPeriodeType } from '../arbeidIPeriodeType';

export type ArbeidsukerProsentSøknadsdata = {
    [key: string]: {
        prosentAvNormalt: number;
    };
};

export type ArbeidsukerTimerSøknadsdata = {
    [key: string]: {
        timerISnittPerUke: number;
    };
};

interface ArbeidISøknadsperiodeJobberIkkeSøknadsdata {
    type: ArbeidIPeriodeType.arbeiderIkke;
    arbeiderIPerioden: false;
}
interface ArbeidISøknadsperiodeJobberVanligSøknadsdata {
    type: ArbeidIPeriodeType.arbeiderVanlig;
    arbeiderIPerioden: true;
    arbeiderRedusert: false;
}
interface ArbeidISøknadsperiodeTimerISnittPerUkeSøknadsdata {
    type: ArbeidIPeriodeType.arbeiderTimerISnittPerUke;
    arbeiderIPerioden: true;
    arbeiderRedusert: true;
    timerISnittPerUke: number;
}
interface ArbeidISøknadsperiodeUlikeTimerISnittPerUkeSøknadsdata {
    type: ArbeidIPeriodeType.arbeiderUlikeTimerISnittPerUke;
    arbeiderIPerioden: true;
    arbeiderRedusert: true;
    arbeidsuker: ArbeidsukerTimerSøknadsdata;
}
interface ArbeidISøknadsperiodeProsentSøknadsdata {
    type: ArbeidIPeriodeType.arbeiderProsentAvNormalt;
    arbeiderIPerioden: true;
    arbeiderRedusert: true;
    prosentAvNormalt: number;
}

interface ArbeidISøknadsperiodeUlikProsentPerUkeSøknadsdata {
    type: ArbeidIPeriodeType.arbeiderUlikProsentPerUkeAvNormalt;
    arbeiderIPerioden: true;
    arbeiderRedusert: true;
    arbeidsuker: ArbeidsukerProsentSøknadsdata;
}

export type ArbeidIPeriodeSøknadsdata =
    | ArbeidISøknadsperiodeJobberVanligSøknadsdata
    | ArbeidISøknadsperiodeJobberIkkeSøknadsdata
    | ArbeidISøknadsperiodeTimerISnittPerUkeSøknadsdata
    | ArbeidISøknadsperiodeUlikeTimerISnittPerUkeSøknadsdata
    | ArbeidISøknadsperiodeProsentSøknadsdata
    | ArbeidISøknadsperiodeUlikProsentPerUkeSøknadsdata;
