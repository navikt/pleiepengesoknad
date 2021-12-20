import { InputTime } from '@navikt/sif-common-formik';
import { ISODate } from '@navikt/sif-common-utils';

/** Toggle fortid/fremtid */
export const useFortidFremtid = 1 + 1 === 2;

export { ISODateRange, ISODuration, ISODate } from '@navikt/sif-common-utils';

export interface TidUkedager {
    mandag?: InputTime;
    tirsdag?: InputTime;
    onsdag?: InputTime;
    torsdag?: InputTime;
    fredag?: InputTime;
}
export interface Tid {
    varighet: Partial<InputTime>;
    prosent?: number;
}

export type DatoMedTid = {
    isoDate: ISODate;
    dato: Date;
    tid: Tid;
};

export type DatoTidArray = DatoMedTid[];

export type DatoTidMap = { [isoDate: ISODate]: Tid };

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
