import { YesOrNo } from 'common/types/YesOrNo';

export interface UtenlandsoppholdBase {
    id?: string;
    fromDate: Date;
    toDate: Date;
    countryCode: string;
}

export interface UtenlandsoppholdIPerioden extends UtenlandsoppholdBase {
    erUtenforEØS: YesOrNo;
    årsak?: string;
}

export type Utenlandsopphold = UtenlandsoppholdBase | UtenlandsoppholdIPerioden;
