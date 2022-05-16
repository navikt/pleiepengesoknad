import { ArbeidIPeriodeSøknadsdata } from './arbeidIPeriodeSøknadsdata';
import { NormalarbeidstidSøknadsdata } from './normalarbeidstidSøknadsdata';

export interface ArbeidsforholdSøknadsdata {
    normalarbeidstid: NormalarbeidstidSøknadsdata;
    arbeidISøknadsperiode?: ArbeidIPeriodeSøknadsdata;
}
