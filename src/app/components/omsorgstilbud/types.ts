import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { Time } from '@navikt/sif-common-formik/lib';

export interface OmsorgstilbudDag {
    dato: Date;
    tid: Partial<Time>;
}

export type TidIOmsorgstilbud = { [isoDateString: string]: Partial<Time> };

export interface OmsorgstilbudMåned {
    skalHaOmsorgstilbud: YesOrNo;
}

export enum SkalHaOmsorgstilbudFormField {
    skalHaOmsorgstilbud = 'skalHaOmsorgstilbud',
}
