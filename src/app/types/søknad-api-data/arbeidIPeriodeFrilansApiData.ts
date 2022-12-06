import { ArbeiderIPeriodenSvar } from '@navikt/sif-common-pleiepenger/lib';
import { ISODate, ISODuration } from '@navikt/sif-common-utils/lib';
import { OmsorgsstønadIPerioden, MisterHonorarerFraVervIPerioden } from '../ArbeidIPeriodeFormValues';
import { ArbeidIPeriodeType } from '../arbeidIPeriodeType';

export type ArbeidsukeTimerApiData = {
    periode: {
        fraOgMed: ISODate;
        tilOgMed: ISODate;
    };
    timer: ISODuration;
};

export interface ArbeidIPeriodeApiDataJobberIkkeEllerSomVanlig {
    type: ArbeidIPeriodeType.arbeiderIkkeEllerVanlig;
    frilansIPeriode?: ArbeiderIPeriodenSvar;
    omsorgsstønadIPerioden?: OmsorgsstønadIPerioden;
    misterHonorarerFraVervIPerioden?: MisterHonorarerFraVervIPerioden;
}

export interface ArbeidIPeriodeApiDataTimerPerUke {
    type: ArbeidIPeriodeType.arbeiderTimerISnittPerUke;
    frilansIPeriode?: ArbeiderIPeriodenSvar;
    omsorgsstønadIPerioden?: OmsorgsstønadIPerioden;
    misterHonorarerFraVervIPerioden?: MisterHonorarerFraVervIPerioden;
    timerPerUke: ISODuration;
}

export interface ArbeidIPeriodeApiDataUlikeUkerTimer {
    type: ArbeidIPeriodeType.arbeiderUlikeUkerTimer;
    frilansIPeriode?: ArbeiderIPeriodenSvar;
    omsorgsstønadIPerioden?: OmsorgsstønadIPerioden;
    misterHonorarerFraVervIPerioden?: MisterHonorarerFraVervIPerioden;
    arbeidsuker: ArbeidsukeTimerApiData[];
}

export type ArbeidIPeriodeFrilansApiData =
    | ArbeidIPeriodeApiDataJobberIkkeEllerSomVanlig
    | ArbeidIPeriodeApiDataTimerPerUke
    | ArbeidIPeriodeApiDataUlikeUkerTimer;
