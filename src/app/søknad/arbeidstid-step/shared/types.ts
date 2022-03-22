import { Duration } from '@navikt/sif-common-utils/lib';

export interface ArbeidstidRegistrertLogProps {
    onArbeidstidEnkeltdagRegistrert?: (info: { antallDager: number }) => void;
    onArbeidPeriodeRegistrert?: (info: { verdi: 'prosent' | 'ukeplan'; prosent?: string }) => void;
}

export interface ArbeidstimerDag {
    faktisk: Duration;
    normalt: Duration;
}

export interface ArbeidstimerFasteDager {
    mandag?: ArbeidstimerDag;
    tirsdag?: ArbeidstimerDag;
    onsdag?: ArbeidstimerDag;
    torsdag?: ArbeidstimerDag;
    fredag?: ArbeidstimerDag;
}
