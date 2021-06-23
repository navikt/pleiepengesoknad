import { Time } from '@navikt/sif-common-formik/lib';
import { ISODateString } from 'nav-datovelger/lib/types';

export interface OmsorgstilbudDag {
    dato: Date;
    tid: Partial<Time>;
}

export type TidIOmsorgstilbud = { [isoDateString: string]: Partial<Time> };

export enum SkalHaOmsorgstilbudFormField {
    skalHaOmsorgstilbud = 'skalHaOmsorgstilbud',
}

export interface Daginfo {
    isoDateString: ISODateString;
    dato: Date;
    ukedag: number;
    årOgUke: string;
    ukenummer: number;
    år: number;
    labelDag: string;
    labelDato: string;
    labelFull: string;
    tid?: Time;
}

export interface Ukeinfo {
    år: number;
    ukenummer: number;
    dager: Daginfo[];
}
