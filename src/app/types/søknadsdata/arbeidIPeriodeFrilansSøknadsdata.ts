import { DateRange } from '@navikt/sif-common-formik/lib';
import { ArbeiderIPeriodenSvar } from '@navikt/sif-common-pleiepenger/lib';
import { OmsorgsstønadIPerioden, VervSvar } from '../ArbeidIPeriodeFormValues';
import { ArbeidIPeriodeType } from '../arbeidIPeriodeType';

export type ArbeidsukerTimerSøknadsdata = {
    periode: DateRange;
    timer: number;
}[];

interface ArbeidISøknadsperiodeJobberIkkeEllerVanligSøknadsdata {
    type: ArbeidIPeriodeType.arbeiderIkkeEllerVanlig;
    frilansIPeriode?: ArbeiderIPeriodenSvar;
    omsorgsstønad?: OmsorgsstønadIPerioden;
    verv?: VervSvar;
}
interface ArbeidISøknadsperiodeTimerISnittPerUkeSøknadsdata {
    type: ArbeidIPeriodeType.arbeiderTimerISnittPerUke;
    frilansIPeriode?: ArbeiderIPeriodenSvar;
    omsorgsstønad?: OmsorgsstønadIPerioden;
    verv?: VervSvar;
    timerISnittPerUke: number;
}

interface ArbeidISøknadsperiodeUlikeUkerTimer {
    type: ArbeidIPeriodeType.arbeiderUlikeUkerTimer;
    frilansIPeriode?: ArbeiderIPeriodenSvar;
    omsorgsstønad?: OmsorgsstønadIPerioden;
    verv?: VervSvar;
    arbeidsuker: ArbeidsukerTimerSøknadsdata;
}

export type ArbeidIPeriodeFrilansSøknadsdata =
    | ArbeidISøknadsperiodeJobberIkkeEllerVanligSøknadsdata
    | ArbeidISøknadsperiodeTimerISnittPerUkeSøknadsdata
    | ArbeidISøknadsperiodeUlikeUkerTimer;
