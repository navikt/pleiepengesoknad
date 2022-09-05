import { DateDurationMap, DurationWeekdays } from '@navikt/sif-common-utils/lib';
import { OmsorgstilbudSvar } from '../søknad-api-data/SøknadApiData';

export interface ErIOmsorgstilbudFasteDagerSøknadsdata {
    type: 'erIOmsorgstilbudFasteDager';
    svar: OmsorgstilbudSvar.FAST_OG_REGELMESSIG;
    fasteDager: DurationWeekdays;
}

export interface ErIOmsorgstilbudEnkeltDagerSøknadsdata {
    type: 'erIOmsorgstilbudEnkeltDager';
    svar: OmsorgstilbudSvar.FAST_OG_REGELMESSIG;
    enkeltdager: DateDurationMap;
}

export interface ErIOmsorgstilbudDelvisEnkeltDagerSøknadsdata {
    type: 'erIOmsorgstilbudDelvisEnkeltDager';
    svar: OmsorgstilbudSvar.DELVIS_FAST_OG_REGELMESSIG;
    enkeltdager: DateDurationMap;
}

export interface ErIkkeFastOgRegelmessigSøknadsdata {
    type: 'erIkkeFastOgRegelmessig';
    svar: OmsorgstilbudSvar.IKKE_FAST_OG_REGELMESSIG;
}

export interface ErIkkeIOmsorgstilbudSøknadsdata {
    type: 'erIkkeOmsorgstilbud';
}

export type OmsorgstilbudSøknadsdata =
    | ErIOmsorgstilbudFasteDagerSøknadsdata
    | ErIOmsorgstilbudEnkeltDagerSøknadsdata
    | ErIOmsorgstilbudDelvisEnkeltDagerSøknadsdata
    | ErIkkeFastOgRegelmessigSøknadsdata
    | ErIkkeIOmsorgstilbudSøknadsdata;
