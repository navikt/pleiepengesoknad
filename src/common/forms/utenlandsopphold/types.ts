import { YesOrNo } from 'common/types/YesOrNo';

export interface Utenlandsopphold {
    id?: string;
    fromDate: Date;
    toDate: Date;
    countryCode: string;
}

export interface UtenlandsoppholdIPerioden extends Utenlandsopphold {
    erUtenforEØS: YesOrNo;
    årsak?: string;
}
