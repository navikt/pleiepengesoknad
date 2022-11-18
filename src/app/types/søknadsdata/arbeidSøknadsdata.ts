import { ArbeidsgivereSøknadsdata } from './arbeidAnsattSøknadsdata';
import { FrilansoppdragsgivereSøknadsdata } from './arbeidFrilansOppdragSøknadsdata';
import { FrilansereSøknadsdata } from './arbeidNyFrilansSøknadsdata';
import { ArbeidSelvstendigSøknadsdata } from './arbeidSelvstendigSøknadsdata';
import { OpptjeningUtlandSøknadsdata } from './opptjeningUtlandSøknadsdata';
import { UtenlandskNæringSøknadsdata } from './utenlandskNæringSøknadsdata';

export interface ArbeidSøknadsdata {
    arbeidsgivere?: ArbeidsgivereSøknadsdata;
    frilansOppdrag?: FrilansoppdragsgivereSøknadsdata;
    nyFrilans?: FrilansereSøknadsdata;
    selvstendig?: ArbeidSelvstendigSøknadsdata;
    opptjeningUtland?: OpptjeningUtlandSøknadsdata;
    utenlandskNæring?: UtenlandskNæringSøknadsdata;
}
