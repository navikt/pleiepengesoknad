import { DateDurationMap, DurationWeekdays } from '@navikt/sif-common-utils/lib';

export enum ArbeidIPeriodeType {
    'arbeiderIkke' = 'arbeiderIkke',
    'arbeiderVanlig' = 'arbeiderVanlig',
    'arbeiderEnkeltdager' = 'arbeiderEnkeltdager',
    'arbeiderFasteUkedager' = 'arbeiderFasteUkedager',
    'arbeiderProsentAvNormalt' = 'arbeiderProsentAvNormalt',
    'arbeiderTimerISnittPerUke' = 'arbeiderTimerISnittPerUke',
}

interface ArbeidISøknadsperiodeJobberIkkeSøknadsdata {
    type: ArbeidIPeriodeType.arbeiderIkke;
    arbeiderIPerioden: false;
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
    | ArbeidISøknadsperiodeEnkeltdagerSøknadsdata
    | ArbeidISøknadsperiodeTimerFasteUkedagerSøknadsdata
    | ArbeidISøknadsperiodeTimerISnittPerUkeSøknadsdata
    | ArbeidISøknadsperiodeProsentSøknadsdata;
