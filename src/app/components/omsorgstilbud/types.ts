import { Time } from '@navikt/sif-common-formik/lib';

export interface OmsorgstilbudDag {
    dato: Date;
    tid: Partial<Time>;
}

export type TidIOmsorgstilbud = { [isoDateString: string]: Partial<Time> };

export enum SkalHaOmsorgstilbudFormField {
    skalHaOmsorgstilbud = 'skalHaOmsorgstilbud',
}
