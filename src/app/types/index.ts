import { InputTime } from '@navikt/sif-common-formik/lib';
import { ValidationFunction } from '@navikt/sif-common-formik/lib/validation/types';
import { ValidationError } from 'schema-utils';

export interface DagMedTid {
    dato: Date;
    tid: InputTime;
    prosent?: number;
}

export type ISODateRange = string;
export type ISODuration = string;
export type ISODate = string;

export interface TidFasteDager {
    mandag?: InputTime;
    tirsdag?: InputTime;
    onsdag?: InputTime;
    torsdag?: InputTime;
    fredag?: InputTime;
}

export type TidEnkeltdag = { [isoDateString: string]: Partial<InputTime> };

export type TidDagValidator = (dag: string) => ValidationFunction<ValidationError>;

export enum TimerEllerProsent {
    PROSENT = 'prosent',
    TIMER = 'timer',
}

export enum BarnRelasjon {
    MOR = 'MOR',
    FAR = 'FAR',
    MEDMOR = 'MEDMOR',
    FOSTERFORELDER = 'FOSTERFORELDER',
    ANNET = 'ANNET',
}

export enum JobberIPeriodeSvar {
    JA = 'JA',
    NEI = 'NEI',
    // VET_IKKE = 'VET_IKKE',
}

export enum ArbeidsforholdType {
    ANSATT = 'ANSATT',
    FRILANSER = 'FRILANSER',
    SELVSTENDIG = 'SELVSTENDIG',
}

export enum AndreYtelserFraNAV {
    'dagpenger' = 'dagpenger',
    'foreldrepenger' = 'foreldrepenger',
    'svangerskapspenger' = 'svangerskapspenger',
    'sykepenger' = 'sykepenger',
    'omsorgspenger' = 'omsorgspenger',
    'opplæringspenger' = 'opplæringspenger',
}
