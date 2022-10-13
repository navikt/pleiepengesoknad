import { ArbeiderIPeriodenSvar } from '@navikt/sif-common-pleiepenger/lib';
import { ISODuration } from '@navikt/sif-common-utils/lib';
import { ArbeidIPeriodeType } from '../arbeidIPeriodeType';

export type ArbeidsukerProsentApiData = {
    [key: string]: {
        prosentAvNormalt: number;
    };
};

export type ArbeidsukerTimerApiData = {
    [key: string]: {
        timer: ISODuration;
    };
};

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

export interface ArbeidIPeriodeApiDataUlikeUkerProsent {
    type: ArbeidIPeriodeType.arbeiderUlikeUkerProsent;
    arbeiderIPerioden: ArbeiderIPeriodenSvar.redusert;
    arbeidsuker: ArbeidsukerProsentApiData;
}

export interface ArbeidIPeriodeApiDataUlikeUkerTimer {
    type: ArbeidIPeriodeType.arbeiderUlikeUkerTimer;
    arbeiderIPerioden: ArbeiderIPeriodenSvar.redusert;
    arbeidsuker: ArbeidsukerTimerApiData;
}

export type ArbeidIPeriodeApiData =
    | ArbeidIPeriodeApiDataJobberIkke
    | ArbeidIPeriodeApiDataJobberVanlig
    | ArbeidIPeriodeApiDataProsent
    | ArbeidIPeriodeApiDataTimerPerUke
    | ArbeidIPeriodeApiDataUlikeUkerProsent
    | ArbeidIPeriodeApiDataUlikeUkerTimer;
