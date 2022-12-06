import { ArbeiderIPeriodenSvar } from '@navikt/sif-common-pleiepenger/lib';
import { ISODuration } from '@navikt/sif-common-utils/lib';
import { OmsorgsstønadIPerioden, MisterHonorarerFraVervIPerioden } from '../ArbeidIPeriodeFormValues';
import { ArbeidIPeriodeType } from '../arbeidIPeriodeType';
import { ArbeidsukeTimerApiData } from './arbeidIPeriodeApiData';

export interface ArbeidIPeriodeApiDataJobberIkkeEllerSomVanlig {
    type: ArbeidIPeriodeType.arbeiderIkkeEllerVanlig;
    frilanserIPerioden?: ArbeiderIPeriodenSvar;
    omsorgsstønadIPerioden?: OmsorgsstønadIPerioden;
    misterHonorarerFraVervIPerioden?: MisterHonorarerFraVervIPerioden;
}

export interface ArbeidIPeriodeApiDataTimerPerUke {
    type: ArbeidIPeriodeType.arbeiderTimerISnittPerUke;
    frilanserIPerioden?: ArbeiderIPeriodenSvar;
    omsorgsstønadIPerioden?: OmsorgsstønadIPerioden;
    misterHonorarerFraVervIPerioden?: MisterHonorarerFraVervIPerioden;
    timerPerUke: ISODuration;
}

export interface ArbeidIPeriodeApiDataUlikeUkerTimer {
    type: ArbeidIPeriodeType.arbeiderUlikeUkerTimer;
    frilanserIPerioden?: ArbeiderIPeriodenSvar;
    omsorgsstønadIPerioden?: OmsorgsstønadIPerioden;
    misterHonorarerFraVervIPerioden?: MisterHonorarerFraVervIPerioden;
    arbeidsuker: ArbeidsukeTimerApiData[];
}

export type ArbeidIPeriodeFrilansApiData =
    | ArbeidIPeriodeApiDataJobberIkkeEllerSomVanlig
    | ArbeidIPeriodeApiDataTimerPerUke
    | ArbeidIPeriodeApiDataUlikeUkerTimer;
