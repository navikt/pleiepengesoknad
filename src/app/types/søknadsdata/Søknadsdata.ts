import { DateRange } from '@navikt/sif-common-formik/lib';
import { ArbeidSøknadsdata } from './arbeidSøknadsdata';
import { MedlemskapSøknadsdata } from './medlemsskapSøknadsdata';

export * from './arbeidIPeriodeSøknadsdata';
export * from './arbeidAnsattSøknadsdata';
export * from './arbeidFrilansSøknadsdata';
export * from './arbeidSelvstendigSøknadsdata';
export * from './arbeidSøknadsdata';
export * from './arbeidsforholdSøknadsdata';
export * from './normalarbeidstidSøknadsdata';
export * from './medlemsskapSøknadsdata';

export interface Søknadsdata {
    søknadsperiode?: DateRange;
    arbeid?: ArbeidSøknadsdata;
    medlemskap?: MedlemskapSøknadsdata;
}
