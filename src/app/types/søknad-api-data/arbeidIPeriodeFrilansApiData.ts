import { ArbeiderIPeriodenSvar } from '@navikt/sif-common-pleiepenger/lib';
import { ISODate, ISODuration } from '@navikt/sif-common-utils/lib';
import { OmsorgsstønadSvar, VervSvar } from '../ArbeidIPeriodeFormValues';
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
    omsorgsstønad?: OmsorgsstønadSvar;
    verv?: VervSvar;
}

export interface ArbeidIPeriodeApiDataTimerPerUke {
    type: ArbeidIPeriodeType.arbeiderTimerISnittPerUke;
    frilansIPeriode?: ArbeiderIPeriodenSvar;
    omsorgsstønad?: OmsorgsstønadSvar;
    verv?: VervSvar;
    timerPerUke: ISODuration;
}

export interface ArbeidIPeriodeApiDataUlikeUkerTimer {
    type: ArbeidIPeriodeType.arbeiderUlikeUkerTimer;
    frilansIPeriode?: ArbeiderIPeriodenSvar;
    omsorgsstønad?: OmsorgsstønadSvar;
    verv?: VervSvar;
    arbeidsuker: ArbeidsukeTimerApiData[];
}

export type ArbeidIPeriodeFrilansApiData =
    | ArbeidIPeriodeApiDataJobberIkkeEllerSomVanlig
    | ArbeidIPeriodeApiDataTimerPerUke
    | ArbeidIPeriodeApiDataUlikeUkerTimer;
