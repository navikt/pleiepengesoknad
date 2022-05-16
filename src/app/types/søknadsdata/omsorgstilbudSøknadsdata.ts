import { DateDurationMap, DurationWeekdays } from '@navikt/sif-common-utils/lib';

export interface ErIOmsorgstilbudFasteDagerSøknadsdata {
    type: 'erIOmsorgstilbudFasteDager';
    fasteDager: DurationWeekdays;
}

export interface ErIOmsorgstilbudEnkeltDagerSøknadsdata {
    type: 'erIOmsorgstilbudEnkeltDager';
    enkeltdager: DateDurationMap;
}

export type OmsorgstilbudSøknadsdata = ErIOmsorgstilbudFasteDagerSøknadsdata | ErIOmsorgstilbudEnkeltDagerSøknadsdata;
