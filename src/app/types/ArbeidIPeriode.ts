import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { DateDurationMap, DurationWeekdays } from '@navikt/sif-common-utils/lib';
import { JobberIPeriodeSvar } from './JobberIPeriodenSvar';
import { TimerEllerProsent } from './TimerEllerProsent';

export enum ArbeidIPeriodeField {
    jobberIPerioden = 'jobberIPerioden',
    erLiktHverUke = 'erLiktHverUke',
    timerEllerProsent = 'timerEllerProsent',
    jobberProsent = 'jobberProsent',
    fasteDager = 'fasteDager',
    enkeltdager = 'enkeltdager',
}

export interface ArbeidIPeriode {
    [ArbeidIPeriodeField.jobberIPerioden]: JobberIPeriodeSvar;
    [ArbeidIPeriodeField.erLiktHverUke]?: YesOrNo;
    [ArbeidIPeriodeField.timerEllerProsent]?: TimerEllerProsent;
    [ArbeidIPeriodeField.jobberProsent]?: string;
    [ArbeidIPeriodeField.enkeltdager]?: DateDurationMap;
    [ArbeidIPeriodeField.fasteDager]?: DurationWeekdays;
}
