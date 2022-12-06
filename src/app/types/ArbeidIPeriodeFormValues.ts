import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { ArbeiderIPeriodenSvar } from '@navikt/sif-common-pleiepenger/lib';
import { TimerEllerProsent } from './TimerEllerProsent';

export enum OmsorgsstønadIPerioden {
    'misterOmsorgsstønad' = 'MISTER_OMSORGSTØNAD',
    'mottarRedusert' = 'MOTTAR_REDUSERT_OMSORGSTØNAD',
    'beholderHeleOmsorgsstønad' = 'BEHOLDER_HELE__OMSORGSTØNAD',
}

export enum MisterHonorarerFraVervIPerioden {
    'misterAlleHonorarer' = 'MISTER_ALLE_HONORARER',
    'misterDelerAvHonorarer' = 'MISTER_DELER_AV_HONORARER',
}

export enum ArbeidIPeriodeFormField {
    arbeiderIPerioden = 'arbeiderIPerioden',
    omsorgsstønadIPerioden = 'omsorgsstønadIPerioden',
    misterHonorarerFraVervIPerioden = 'misterHonorarerFraVervIPerioden',
    erLiktHverUke = 'erLiktHverUke',
    timerEllerProsent = 'timerEllerProsent',
    prosentAvNormalt = 'prosentAvNormalt',
    snittTimerPerUke = 'snittTimerPerUke',
    arbeidsuker = 'arbeidsuker',
}

export type ArbeidsukerFormValues = {
    [key: string]: {
        [ArbeidIPeriodeFormField.prosentAvNormalt]?: string;
        [ArbeidIPeriodeFormField.snittTimerPerUke]?: string;
    };
};

export interface ArbeidIPeriodeFormValues {
    [ArbeidIPeriodeFormField.arbeiderIPerioden]?: ArbeiderIPeriodenSvar;
    [ArbeidIPeriodeFormField.omsorgsstønadIPerioden]?: OmsorgsstønadIPerioden;
    [ArbeidIPeriodeFormField.misterHonorarerFraVervIPerioden]?: MisterHonorarerFraVervIPerioden;
    [ArbeidIPeriodeFormField.erLiktHverUke]?: YesOrNo;
    [ArbeidIPeriodeFormField.timerEllerProsent]?: TimerEllerProsent;
    [ArbeidIPeriodeFormField.prosentAvNormalt]?: string;
    [ArbeidIPeriodeFormField.snittTimerPerUke]?: string;
    [ArbeidIPeriodeFormField.arbeidsuker]?: ArbeidsukerFormValues;
}
