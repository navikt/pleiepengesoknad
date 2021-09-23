import { Time } from '@navikt/sif-common-formik/lib';
import { ValidationFunction } from '@navikt/sif-common-formik/lib/validation/types';
import { ValidationError } from 'schema-utils';

export interface DagMedTid {
    dato: Date;
    tid: Partial<Time>;
}

export type TidsbrukDag = { [isoDateString: string]: Partial<Time> };

export type TidDagValidator = (dag: string) => ValidationFunction<ValidationError>;
