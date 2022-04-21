import { DateRange } from '@navikt/sif-common-formik/lib';
import { ArbeidSøknadsdata } from './arbeidSøknadsdata';
import { BeredskapSøknadsdata } from './beredskapSøknadsdata';
import { FerieuttakIPeriodenSøknadsdata } from './ferieuttakIPeriodenSøknadsdata';
import { MedlemskapSøknadsdata } from './medlemsskapSøknadsdata';
import { MedsøkerSøknadsdata } from './medsøkerSøknadsdata';
import { NattevåkSøknadsdata } from './nattevåkSøknadsdata';
import { OmBarnetSøknadsdata } from './omBarnetSøknadsdata';
import { UtenlandsoppholdIPeriodenSøknadsdata } from './utenlandsoppholdIPeriodenSøknadsdata';

export * from './omBarnetSøknadsdata';
export * from './arbeidIPeriodeSøknadsdata';
export * from './arbeidAnsattSøknadsdata';
export * from './arbeidFrilansSøknadsdata';
export * from './arbeidSelvstendigSøknadsdata';
export * from './arbeidSøknadsdata';
export * from './arbeidsforholdSøknadsdata';
export * from './normalarbeidstidSøknadsdata';
export * from './medlemsskapSøknadsdata';
export * from './medsøkerSøknadsdata';
export * from './utenlandsoppholdIPeriodenSøknadsdata';
export * from './ferieuttakIPeriodenSøknadsdata';
export * from './nattevåkSøknadsdata';
export * from './beredskapSøknadsdata';

export interface Søknadsdata {
    søknadsperiode?: DateRange;
    barn?: OmBarnetSøknadsdata;
    medsøker?: MedsøkerSøknadsdata;
    utenlandsoppholdIPerioden?: UtenlandsoppholdIPeriodenSøknadsdata;
    ferieuttakIPerioden?: FerieuttakIPeriodenSøknadsdata;
    arbeid?: ArbeidSøknadsdata;
    harVærtEllerErVernepliktig?: boolean;
    nattevåk?: NattevåkSøknadsdata;
    beredskap?: BeredskapSøknadsdata;
    medlemskap?: MedlemskapSøknadsdata;
}
