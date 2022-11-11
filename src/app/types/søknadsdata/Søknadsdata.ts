import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { ArbeidSøknadsdata } from './arbeidSøknadsdata';
import { BeredskapSøknadsdata } from './beredskapSøknadsdata';
import { FerieuttakIPeriodenSøknadsdata } from './ferieuttakIPeriodenSøknadsdata';
import { MedlemskapSøknadsdata } from './medlemsskapSøknadsdata';
import { MedsøkerSøknadsdata } from './medsøkerSøknadsdata';
import { NattevåkSøknadsdata } from './nattevåkSøknadsdata';
import { OmBarnetSøknadsdata } from './omBarnetSøknadsdata';
import { OmsorgstilbudSøknadsdata } from './omsorgstilbudSøknadsdata';
import { UtenlandsoppholdIPeriodenSøknadsdata } from './utenlandsoppholdIPeriodenSøknadsdata';

export * from './omBarnetSøknadsdata';
export * from './arbeidIPeriodeSøknadsdata';
export * from './arbeidAnsattSøknadsdata';
export * from './arbeidFrilansOppdragSøknadsdata';
// export * from './arbeidNyFrilansSøknadsdata';
export * from './arbeidFrilansSøknadsdata';
export * from './arbeidSelvstendigSøknadsdata';
export * from './opptjeningUtlandSøknadsdata';
export * from './utenlandskNæringSøknadsdata';
export * from './arbeidSøknadsdata';
export * from './arbeidsforholdSøknadsdata';
export * from './normalarbeidstidSøknadsdata';
export * from './medlemsskapSøknadsdata';
export * from './medsøkerSøknadsdata';
export * from './utenlandsoppholdIPeriodenSøknadsdata';
export * from './ferieuttakIPeriodenSøknadsdata';
export * from './nattevåkSøknadsdata';
export * from './beredskapSøknadsdata';
export * from './omsorgstilbudSøknadsdata';

export interface Søknadsdata {
    harForståttRettigheterOgPlikter?: boolean;
    søknadsperiode?: DateRange;
    barn?: OmBarnetSøknadsdata;
    medsøker?: MedsøkerSøknadsdata;
    utenlandsoppholdIPerioden?: UtenlandsoppholdIPeriodenSøknadsdata;
    ferieuttakIPerioden?: FerieuttakIPeriodenSøknadsdata;
    arbeid?: ArbeidSøknadsdata;
    harVærtEllerErVernepliktig?: boolean;
    omsorgstibud?: OmsorgstilbudSøknadsdata;
    nattevåk?: NattevåkSøknadsdata;
    beredskap?: BeredskapSøknadsdata;
    medlemskap?: MedlemskapSøknadsdata;
    legeerklæring?: Attachment[];
}
