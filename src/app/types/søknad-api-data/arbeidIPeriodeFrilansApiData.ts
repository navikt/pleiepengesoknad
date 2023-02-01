import { ArbeiderIPeriodenSvar } from '@navikt/sif-common-pleiepenger/lib';
import { ISODuration } from '@navikt/sif-common-utils/lib';
import { ArbeidIPeriodeType } from '../arbeidIPeriodeType';
import { ArbeidsukeTimerApiData } from './arbeidIPeriodeApiData';

export interface ArbeidIPeriodeApiDataJobberIkkeEllerSomVanlig {
    type: ArbeidIPeriodeType.arbeiderIkkeEllerVanlig;
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
    | ArbeidIPeriodeApiDataJobberIkkeEllerSomVanlig
    | ArbeidIPeriodeApiDataTimerPerUke
    | ArbeidIPeriodeApiDataUlikeUkerTimer;
