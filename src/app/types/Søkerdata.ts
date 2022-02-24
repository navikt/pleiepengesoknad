import { Søker } from './';
import { Arbeidsgiver } from './Arbeidsgiver';
import { RegistrerteBarn } from './RegistrerteBarn';

export interface Søkerdata {
    søker: Søker;
    barn: RegistrerteBarn[];
    orgArbeidsgivere?: Arbeidsgiver[];
    privateArbeidsgivere: Arbeidsgiver[];
    frilansoppdrag: Arbeidsgiver[];
    onArbeidsgivereChange: (arbeidsgivere: Arbeidsgiver[]) => void;
}
