import { Time } from '@navikt/sif-common-formik/lib';
import { ValidationFunction } from '@navikt/sif-common-formik/lib/validation/types';
import { ValidationError } from 'schema-utils';

export interface DagMedTid {
    dato: Date;
    tid: Partial<Time>;
}

export type TidsbrukDag = { [isoDateString: string]: Partial<Time> };

export type TidDagValidator = (dag: string) => ValidationFunction<ValidationError>;

export enum Arbeidsform {
    fast = 'FAST',
    turnus = 'TURNUS',
    varierende = 'VARIERENDE',
}

export enum BarnRelasjon {
    MOR = 'MOR',
    FAR = 'FAR',
    MEDMOR = 'MEDMOR',
    FOSTERFORELDER = 'FOSTERFORELDER',
    ANNET = 'ANNET',
}

export enum AndreYtelserFraNAV {
    'dagpenger' = 'dagpenger',
    'foreldrepenger' = 'foreldrepenger',
    'svangerskapspenger' = 'svangerskapspenger',
    'sykepenger' = 'sykepenger',
    'omsorgspenger' = 'omsorgspenger',
    'opplæringspenger' = 'opplæringspenger',
}

export enum JobberSvar {
    JA = 'JA',
    NEI = 'NEI',
    REDUSERT = 'REDUSERT',
    VET_IKKE = 'VET_IKKE',
}

export enum ArbeidsforholdType {
    ANSATT = 'ANSATT',
    FRILANSER = 'FRILANSER',
    SELVSTENDIG = 'SELVSTENDIG',
}

export enum VetOmsorgstilbud {
    'VET_ALLE_TIMER' = 'VET_ALLE_TIMER',
    'VET_IKKE' = 'VET_IKKE',
}
