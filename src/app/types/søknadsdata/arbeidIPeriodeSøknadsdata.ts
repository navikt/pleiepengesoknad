import { ArbeidIPeriodeType } from '../arbeidIPeriodeType';

export type ArbeidsukerProsentSøknadsdata = {
    [key: string]: {
        prosentAvNormalt: number;
    };
};

export type ArbeidsukerTimerSøknadsdata = {
    [key: string]: {
        timer: number;
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
interface ArbeidISøknadsperiodeProsentSøknadsdata {
    type: ArbeidIPeriodeType.arbeiderProsentAvNormalt;
    arbeiderIPerioden: true;
    arbeiderRedusert: true;
    prosentAvNormalt: number;
}

interface ArbeidISøknadsperiodeUlikeUkerProsent {
    type: ArbeidIPeriodeType.arbeiderUlikeUkerProsent;
    arbeiderIPerioden: true;
    arbeiderRedusert: true;
    arbeidsuker: ArbeidsukerProsentSøknadsdata;
}

interface ArbeidISøknadsperiodeUlikeUkerTimer {
    type: ArbeidIPeriodeType.arbeiderUlikeUkerTimer;
    arbeiderIPerioden: true;
    arbeiderRedusert: true;
    arbeidsuker: ArbeidsukerTimerSøknadsdata;
}

export type ArbeidIPeriodeSøknadsdata =
    | ArbeidISøknadsperiodeJobberVanligSøknadsdata
    | ArbeidISøknadsperiodeJobberIkkeSøknadsdata
    | ArbeidISøknadsperiodeTimerISnittPerUkeSøknadsdata
    | ArbeidISøknadsperiodeProsentSøknadsdata
    | ArbeidISøknadsperiodeUlikeUkerTimer
    | ArbeidISøknadsperiodeUlikeUkerProsent;
