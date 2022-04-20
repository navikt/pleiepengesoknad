import { Ferieuttak } from '@navikt/sif-common-forms/lib/ferieuttak/types';

export interface SkalTaUtFerieSøknadsdataSøknadsdata {
    type: 'skalTaUtFerieSøknadsdata';
    skalTaUtFerieIPerioden: true;
    ferieuttak: Ferieuttak[];
}
export interface SkalIkkeTaUtFerieSøknadsdataSøknadsdata {
    type: 'skalIkkeTaUtFerieSøknadsdata';
    skalTaUtFerieIPerioden: false;
}

export type FerieuttakIPeriodenSøknadsdata =
    | SkalTaUtFerieSøknadsdataSøknadsdata
    | SkalIkkeTaUtFerieSøknadsdataSøknadsdata;
