// import { InputTime } from '@navikt/sif-common-formik/lib';
import { ISODate } from '../../types';

export interface Daginfo {
    isoDate: ISODate;
    dato: Date;
    ukedag: number;
    årOgUke: string;
    ukenummer: number;
    år: number;
    labelDag: string;
    labelDato: string;
    labelFull: string;
}

export interface Ukeinfo {
    år: number;
    ukenummer: number;
    dager: Daginfo[];
}
