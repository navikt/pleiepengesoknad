import { ArbeiderIPeriodenSvar } from '@navikt/sif-common-pleiepenger/lib';
import { ISODuration } from '@navikt/sif-common-utils/lib';
import { ArbeidIPeriodeType } from '../arbeidIPeriodeType';
import { ArbeidsukeTimerApiData } from './arbeidIPeriodeApiData';

export interface ArbeidIPeriodeApiDataJobberIkke {
    type: ArbeidIPeriodeType.arbeiderIkke;
    arbeiderIPerioden?: ArbeiderIPeriodenSvar;
}

export interface ArbeidIPeriodeApiDataJobberSomVanlig {
    type: ArbeidIPeriodeType.arbeiderVanlig;
    arbeiderIPerioden?: ArbeiderIPeriodenSvar;
}

export interface ArbeidIPeriodeApiDataTimerPerUke {
    type: ArbeidIPeriodeType.arbeiderTimerISnittPerUke;
    arbeiderIPerioden?: ArbeiderIPeriodenSvar;
    timerPerUke: ISODuration;
}

export interface ArbeidIPeriodeApiDataUlikeUkerTimer {
    type: ArbeidIPeriodeType.arbeiderUlikeUkerTimer;
    arbeiderIPerioden?: ArbeiderIPeriodenSvar;
    arbeidsuker: ArbeidsukeTimerApiData[];
}

export type ArbeidIPeriodeFrilansApiData =
    | ArbeidIPeriodeApiDataJobberIkke
    | ArbeidIPeriodeApiDataJobberSomVanlig
    | ArbeidIPeriodeApiDataTimerPerUke
    | ArbeidIPeriodeApiDataUlikeUkerTimer;
