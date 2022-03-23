import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { DateDurationMap, DurationWeekdays } from '@navikt/sif-common-utils/lib';
import { JobberIPeriodeSvar } from './JobberIPeriodenSvar';
import { TimerEllerProsent } from './TimerEllerProsent';

export enum ArbeidIPeriodeFormField {
    jobberIPerioden = 'jobberIPerioden',
    erLiktHverUke = 'erLiktHverUke',
    timerEllerProsent = 'timerEllerProsent',
    jobberProsent = 'jobberProsent',
    fasteDager = 'fasteDager',
    enkeltdager = 'enkeltdager',
}

export interface ArbeidIPeriodeFormData {
    [ArbeidIPeriodeFormField.jobberIPerioden]: JobberIPeriodeSvar;
    [ArbeidIPeriodeFormField.erLiktHverUke]?: YesOrNo;
    [ArbeidIPeriodeFormField.timerEllerProsent]?: TimerEllerProsent;
    [ArbeidIPeriodeFormField.jobberProsent]?: string;
    [ArbeidIPeriodeFormField.enkeltdager]?: DateDurationMap;
    [ArbeidIPeriodeFormField.fasteDager]?: DurationWeekdays;
}
