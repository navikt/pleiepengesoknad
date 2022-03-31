import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { DateDurationMap, DurationWeekdays } from '@navikt/sif-common-utils/lib';
import { TimerEllerProsent } from './TimerEllerProsent';

export enum ArbeidIPeriodeFormField {
    jobberIPerioden = 'jobberIPerioden',
    erLiktHverUke = 'erLiktHverUke',
    timerEllerProsent = 'timerEllerProsent',
    jobberProsent = 'jobberProsent',
    jobberTimer = 'jobberTimer',
    fasteDager = 'fasteDager',
    enkeltdager = 'enkeltdager',
}

export interface ArbeidIPeriodeFormData {
    [ArbeidIPeriodeFormField.jobberIPerioden]: YesOrNo;
    [ArbeidIPeriodeFormField.erLiktHverUke]?: YesOrNo;
    [ArbeidIPeriodeFormField.timerEllerProsent]?: TimerEllerProsent;
    [ArbeidIPeriodeFormField.jobberProsent]?: string;
    [ArbeidIPeriodeFormField.jobberTimer]?: string;
    [ArbeidIPeriodeFormField.enkeltdager]?: DateDurationMap;
    [ArbeidIPeriodeFormField.fasteDager]?: DurationWeekdays;
}
