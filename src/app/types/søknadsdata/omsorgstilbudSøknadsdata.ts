import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { DateDurationMap, DurationWeekdays } from '@navikt/sif-common-utils/lib';

export interface ErIOmsorgstilbudFremtidUsikkerSøknadsdata {
    type: 'erIOmsorgstilbudFremtidUsikker';
}

export interface ErIOmsorgstilbudFasteDagerSøknadsdata {
    type: 'erIOmsorgstilbudFasteDager';
    erIOmsorgstilbudFortid?: YesOrNo;
    erIOmsorgstilbudFremtid?: YesOrNo;
    fasteDager: DurationWeekdays;
}

export interface ErIOmsorgstilbudEnkeltDagerSøknadsdata {
    type: 'erIOmsorgstilbudEnkeltDager';
    erIOmsorgstilbudFortid?: YesOrNo;
    erIOmsorgstilbudFremtid?: YesOrNo;
    enkeltdager: DateDurationMap;
}

export type OmsorgstilbudSøknadsdata =
    | ErIOmsorgstilbudFremtidUsikkerSøknadsdata
    | ErIOmsorgstilbudFasteDagerSøknadsdata
    | ErIOmsorgstilbudEnkeltDagerSøknadsdata;
