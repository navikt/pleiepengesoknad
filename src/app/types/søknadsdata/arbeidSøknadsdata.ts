import { ArbeidsgivereSøknadsdata } from './arbeidAnsattSøknadsdata';
import { OppdragsgivereSøknadsdata } from './arbeidFrilansOppdragSøknadsdata';
import { FrilansereSøknadsdata } from './arbeidNyFrilansSøknadsdata';
import { ArbeidSelvstendigSøknadsdata } from './arbeidSelvstendigSøknadsdata';
import { OpptjeningUtlandSøknadsdata } from './opptjeningUtlandSøknadsdata';
import { UtenlandskNæringSøknadsdata } from './utenlandskNæringSøknadsdata';

export interface ArbeidSøknadsdata {
    arbeidsgivere?: ArbeidsgivereSøknadsdata;
    frilansOppdrag?: OppdragsgivereSøknadsdata;
    nyFrilans?: FrilansereSøknadsdata;
    selvstendig?: ArbeidSelvstendigSøknadsdata;
    opptjeningUtland?: OpptjeningUtlandSøknadsdata;
    utenlandskNæring?: UtenlandskNæringSøknadsdata;
}
