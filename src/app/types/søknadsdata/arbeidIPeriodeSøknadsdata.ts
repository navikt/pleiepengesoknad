import { DateDurationMap, DurationWeekdays } from '@navikt/sif-common-utils/lib';

export enum ArbeidIPeriodeType {
    'arbeiderIkke' = 'ARBEIDER_IKKE',
    'arbeiderVanlig' = 'ARBEIDER_VANLIG',
    'arbeiderKunSmåoppdrag' = 'ARBEIDER_KUN_SMÅOPPDRAG',
    'arbeiderEnkeltdager' = 'ARBEIDER_ENKELTDAGER',
    'arbeiderFasteUkedager' = 'ARBEIDER_FASTE_UKEDAGER',
    'arbeiderProsentAvNormalt' = 'ARBEIDER_PROSENT_AV_NORMALT',
    'arbeiderTimerISnittPerUke' = 'ARBEIDER_TIMER_I_SNITT_PER_UKE',
}

interface ArbeidISøknadsperiodeJobberIkkeSøknadsdata {
    type: ArbeidIPeriodeType.arbeiderIkke;
    arbeiderIPerioden: false;
}
interface ArbeidISøknadsperiodeJobberKunSmåoppdrag {
    type: ArbeidIPeriodeType.arbeiderKunSmåoppdrag;
    arbeiderIPerioden: true;
}
interface ArbeidISøknadsperiodeJobberVanligSøknadsdata {
    type: ArbeidIPeriodeType.arbeiderVanlig;
    arbeiderIPerioden: true;
    arbeiderRedusert: false;
}
interface ArbeidISøknadsperiodeEnkeltdagerSøknadsdata {
    type: ArbeidIPeriodeType.arbeiderEnkeltdager;
    arbeiderIPerioden: true;
    arbeiderRedusert: true;
    enkeltdager: DateDurationMap;
}
interface ArbeidISøknadsperiodeTimerFasteUkedagerSøknadsdata {
    type: ArbeidIPeriodeType.arbeiderFasteUkedager;
    arbeiderIPerioden: true;
    arbeiderRedusert: true;
    fasteDager: DurationWeekdays;
}
interface ArbeidISøknadsperiodeTimerISnittPerUkeSøknadsdata {
    type: ArbeidIPeriodeType.arbeiderTimerISnittPerUke;
    arbeiderIPerioden: true;
    arbeiderRedusert: true;
    timerISnittPerUke: number;
}
interface ArbeidISøknadsperiodeProsentSøknadsdata {
    type: ArbeidIPeriodeType.arbeiderProsentAvNormalt;
    arbeiderIPerioden: true;
    arbeiderRedusert: true;
    prosentAvNormalt: number;
}

export type ArbeidIPeriodeSøknadsdata =
    | ArbeidISøknadsperiodeJobberVanligSøknadsdata
    | ArbeidISøknadsperiodeJobberIkkeSøknadsdata
    | ArbeidISøknadsperiodeJobberKunSmåoppdrag
    | ArbeidISøknadsperiodeEnkeltdagerSøknadsdata
    | ArbeidISøknadsperiodeTimerFasteUkedagerSøknadsdata
    | ArbeidISøknadsperiodeTimerISnittPerUkeSøknadsdata
    | ArbeidISøknadsperiodeProsentSøknadsdata;
