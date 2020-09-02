import { PersonResponse } from './PersonResponse';
import { Barn } from './BarnResponse';

export interface Søkerdata {
    person: PersonResponse;
    barn: Barn[];
}
