import { DateRange } from '@navikt/sif-common-formik/lib';
import { ArbeiderIPeriodenSvar } from '@navikt/sif-common-pleiepenger/lib';
import { OmsorgsstønadSvar, VervSvar } from '../ArbeidIPeriodeFormValues';
import { ArbeidIPeriodeType } from '../arbeidIPeriodeType';

export type ArbeidsukerTimerSøknadsdata = {
    periode: DateRange;
    timer: number;
}[];

interface ArbeidISøknadsperiodeJobberIkkeEllerVanligSøknadsdata {
    type: ArbeidIPeriodeType.arbeiderIkkeEllerVanlig;
    frilansIPeriode?: ArbeiderIPeriodenSvar;
    omsorgsstønad?: OmsorgsstønadSvar;
    verv?: VervSvar;
}
interface ArbeidISøknadsperiodeTimerISnittPerUkeSøknadsdata {
    type: ArbeidIPeriodeType.arbeiderTimerISnittPerUke;
    frilansIPeriode?: ArbeiderIPeriodenSvar;
    omsorgsstønad?: OmsorgsstønadSvar;
    verv?: VervSvar;
    timerISnittPerUke: number;
}

interface ArbeidISøknadsperiodeUlikeUkerTimer {
    type: ArbeidIPeriodeType.arbeiderUlikeUkerTimer;
    frilansIPeriode?: ArbeiderIPeriodenSvar;
    omsorgsstønad?: OmsorgsstønadSvar;
    verv?: VervSvar;
    arbeidsuker: ArbeidsukerTimerSøknadsdata;
}

export type ArbeidIPeriodeFrilansSøknadsdata =
    | ArbeidISøknadsperiodeJobberIkkeEllerVanligSøknadsdata
    | ArbeidISøknadsperiodeTimerISnittPerUkeSøknadsdata
    | ArbeidISøknadsperiodeUlikeUkerTimer;
