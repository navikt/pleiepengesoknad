import { Barn } from './ListeAvBarn';
import { PersonResponse } from './PersonResponse';
import { Arbeidsgiver } from './ArbeidsgiverResponse';

export interface Søkerdata {
    person: PersonResponse;
    barn: Barn[];
    setArbeidsgivere: (arbeidsgivere: Arbeidsgiver[]) => void;
    arbeidsgivere?: Arbeidsgiver[];
}
