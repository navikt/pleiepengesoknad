import { ArbeiderIPeriodenSvar } from '@navikt/sif-common-pleiepenger/lib';
import { ISODate, ISODuration } from '@navikt/sif-common-utils/lib';
import { ArbeidIPeriodeType } from '../arbeidIPeriodeType';

export type ArbeidsukeProsentApiData = {
    periode: {
        from: ISODate;
        to: ISODate;
    };
    prosentAvNormalt: number;
};

export type ArbeidsukeTimerApiData = {
    periode: {
        from: ISODate;
        to: ISODate;
    };
    timer: ISODuration;
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
    timerPerUke: ISODuration;
}

export interface ArbeidIPeriodeApiDataUlikeUkerProsent {
    type: ArbeidIPeriodeType.arbeiderUlikeUkerProsent;
    arbeiderIPerioden: ArbeiderIPeriodenSvar.redusert;
    arbeidsuker: ArbeidsukeProsentApiData[];
}

export interface ArbeidIPeriodeApiDataUlikeUkerTimer {
    type: ArbeidIPeriodeType.arbeiderUlikeUkerTimer;
    arbeiderIPerioden: ArbeiderIPeriodenSvar.redusert;
    arbeidsuker: ArbeidsukeTimerApiData[];
}

export type ArbeidIPeriodeApiData =
    | ArbeidIPeriodeApiDataJobberIkke
    | ArbeidIPeriodeApiDataJobberVanlig
    | ArbeidIPeriodeApiDataProsent
    | ArbeidIPeriodeApiDataTimerPerUke
    | ArbeidIPeriodeApiDataUlikeUkerProsent
    | ArbeidIPeriodeApiDataUlikeUkerTimer;
