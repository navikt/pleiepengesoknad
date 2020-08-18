import { Barn } from './ListeAvBarn';
import { PersonResponse } from './PersonResponse';

export enum HoursOrPercent {
    'hours' = 'hours',
    'percent' = 'percent',
}

export interface Arbeidsgiver {
    navn: string;
    organisasjonsnummer: string;
}

export interface Søkerdata {
    person: PersonResponse;
    barn: Barn[];
    setArbeidsgivere: (arbeidsgivere: Arbeidsgiver[]) => void;
    arbeidsgivere?: Arbeidsgiver[];
}
