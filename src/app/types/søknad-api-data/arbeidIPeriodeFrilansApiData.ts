import { ArbeiderIPeriodenSvar } from '@navikt/sif-common-pleiepenger/lib';
import { ISODuration } from '@navikt/sif-common-utils/lib';
import { MisterHonorarerFraVervIPerioden } from '../ArbeidIPeriodeFormValues';
import { ArbeidIPeriodeType } from '../arbeidIPeriodeType';
import { ArbeidsukeTimerApiData } from './arbeidIPeriodeApiData';

export interface ArbeidIPeriodeApiDataJobberIkkeEllerSomVanlig {
    type: ArbeidIPeriodeType.arbeiderIkkeEllerVanlig;
    arbeiderIPerioden?: ArbeiderIPeriodenSvar;
    misterHonorarerFraVervIPerioden?: MisterHonorarerFraVervIPerioden;
}

export interface ArbeidIPeriodeApiDataTimerPerUke {
    type: ArbeidIPeriodeType.arbeiderTimerISnittPerUke;
    arbeiderIPerioden?: ArbeiderIPeriodenSvar;
    misterHonorarerFraVervIPerioden?: MisterHonorarerFraVervIPerioden;
    timerPerUke: ISODuration;
}

export interface ArbeidIPeriodeApiDataUlikeUkerTimer {
    type: ArbeidIPeriodeType.arbeiderUlikeUkerTimer;
    arbeiderIPerioden?: ArbeiderIPeriodenSvar;
    misterHonorarerFraVervIPerioden?: MisterHonorarerFraVervIPerioden;
    arbeidsuker: ArbeidsukeTimerApiData[];
}

export type ArbeidIPeriodeFrilansApiData =
    | ArbeidIPeriodeApiDataJobberIkkeEllerSomVanlig
    | ArbeidIPeriodeApiDataTimerPerUke
    | ArbeidIPeriodeApiDataUlikeUkerTimer;
