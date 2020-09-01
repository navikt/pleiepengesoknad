import { PersonResponse } from './PersonResponse';
import { Arbeidsgiver } from './ArbeidsgiverResponse';
import { Barn } from './BarnResponse';

export interface Søkerdata {
    person: PersonResponse;
    barn: Barn[];
    setArbeidsgivere: (arbeidsgivere: Arbeidsgiver[]) => void;
    arbeidsgivere?: Arbeidsgiver[];
}
