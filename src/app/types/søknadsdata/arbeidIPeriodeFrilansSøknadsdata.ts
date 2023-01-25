import { DateRange } from '@navikt/sif-common-formik/lib';
import { ArbeiderIPeriodenSvar } from '@navikt/sif-common-pleiepenger/lib';
import { MisterHonorarerFraVervIPerioden } from '../ArbeidIPeriodeFormValues';
import { ArbeidIPeriodeType } from '../arbeidIPeriodeType';

export type ArbeidsukerTimerSøknadsdata = {
    periode: DateRange;
    timer: number;
}[];

interface ArbeidISøknadsperiodeJobberIkkeEllerVanligSøknadsdata {
    type: ArbeidIPeriodeType.arbeiderIkkeEllerVanlig;
    arbeiderIPerioden?: ArbeiderIPeriodenSvar;
    misterHonorarerFraVervIPerioden?: MisterHonorarerFraVervIPerioden;
}
interface ArbeidISøknadsperiodeTimerISnittPerUkeSøknadsdata {
    type: ArbeidIPeriodeType.arbeiderTimerISnittPerUke;
    arbeiderIPerioden?: ArbeiderIPeriodenSvar;
    misterHonorarerFraVervIPerioden?: MisterHonorarerFraVervIPerioden;
    timerISnittPerUke: number;
}

interface ArbeidISøknadsperiodeUlikeUkerTimer {
    type: ArbeidIPeriodeType.arbeiderUlikeUkerTimer;
    arbeiderIPerioden?: ArbeiderIPeriodenSvar;
    misterHonorarerFraVervIPerioden?: MisterHonorarerFraVervIPerioden;
    arbeidsuker: ArbeidsukerTimerSøknadsdata;
}

export type ArbeidIPeriodeFrilansSøknadsdata =
    | ArbeidISøknadsperiodeJobberIkkeEllerVanligSøknadsdata
    | ArbeidISøknadsperiodeTimerISnittPerUkeSøknadsdata
    | ArbeidISøknadsperiodeUlikeUkerTimer;
