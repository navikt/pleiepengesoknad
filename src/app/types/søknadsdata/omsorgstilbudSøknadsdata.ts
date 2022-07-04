import { DateDurationMap, DurationWeekdays } from '@navikt/sif-common-utils/lib';

export interface ErIOmsorgstilbudFasteDagerSøknadsdata {
    type: 'erIOmsorgstilbudFasteDager';
    usikker: boolean;
    fasteDager: DurationWeekdays;
}

export interface ErIOmsorgstilbudEnkeltDagerSøknadsdata {
    type: 'erIOmsorgstilbudEnkeltDager';
    usikker: boolean;
    enkeltdager: DateDurationMap;
}

export interface ErIOmsorgstilbudUsikkerFastIOmsorgstilbudNOSøknadsdata {
    type: 'erIOmsorgstilbudUsikkerFastIOmsorgstilbudNO';
}

export type OmsorgstilbudSøknadsdata =
    | ErIOmsorgstilbudFasteDagerSøknadsdata
    | ErIOmsorgstilbudEnkeltDagerSøknadsdata
    | ErIOmsorgstilbudUsikkerFastIOmsorgstilbudNOSøknadsdata;
