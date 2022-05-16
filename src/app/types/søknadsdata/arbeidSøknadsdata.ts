import { ArbeidsgivereSøknadsdata } from './arbeidAnsattSøknadsdata';
import { ArbeidFrilansSøknadsdata } from './arbeidFrilansSøknadsdata';
import { ArbeidSelvstendigSøknadsdata } from './arbeidSelvstendigSøknadsdata';

export interface ArbeidSøknadsdata {
    arbeidsgivere?: ArbeidsgivereSøknadsdata;
    frilans?: ArbeidFrilansSøknadsdata;
    selvstendig?: ArbeidSelvstendigSøknadsdata;
}
