import { ArbeiderIPeriodenSvar } from '@navikt/sif-common-pleiepenger/lib';
import { ISODuration } from '@navikt/sif-common-utils/lib';
import { OmsorgsstønadIPerioden, MisterHonorarerFraVervIPerioden } from '../ArbeidIPeriodeFormValues';
import { ArbeidIPeriodeType } from '../arbeidIPeriodeType';
import { ArbeidsukeTimerApiData } from './arbeidIPeriodeApiData';

export interface ArbeidIPeriodeApiDataJobberIkkeEllerSomVanlig {
    type: ArbeidIPeriodeType.arbeiderIkkeEllerVanlig;
    arbeiderIPerioden?: ArbeiderIPeriodenSvar;
    omsorgsstønadIPerioden?: OmsorgsstønadIPerioden;
    misterHonorarerFraVervIPerioden?: MisterHonorarerFraVervIPerioden;
}

export interface ArbeidIPeriodeApiDataTimerPerUke {
    type: ArbeidIPeriodeType.arbeiderTimerISnittPerUke;
    arbeiderIPerioden?: ArbeiderIPeriodenSvar;
    omsorgsstønadIPerioden?: OmsorgsstønadIPerioden;
    misterHonorarerFraVervIPerioden?: MisterHonorarerFraVervIPerioden;
    timerPerUke: ISODuration;
}

export interface ArbeidIPeriodeApiDataUlikeUkerTimer {
    type: ArbeidIPeriodeType.arbeiderUlikeUkerTimer;
    arbeiderIPerioden?: ArbeiderIPeriodenSvar;
    omsorgsstønadIPerioden?: OmsorgsstønadIPerioden;
    misterHonorarerFraVervIPerioden?: MisterHonorarerFraVervIPerioden;
    arbeidsuker: ArbeidsukeTimerApiData[];
}

export type ArbeidIPeriodeFrilansApiData =
    | ArbeidIPeriodeApiDataJobberIkkeEllerSomVanlig
    | ArbeidIPeriodeApiDataTimerPerUke
    | ArbeidIPeriodeApiDataUlikeUkerTimer;
