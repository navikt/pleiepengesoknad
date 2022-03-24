import { DateRange } from '@navikt/sif-common-formik/lib';
import { Virksomhet } from '@navikt/sif-common-forms/lib';
import { DurationWeekdays } from '@navikt/sif-common-utils/lib';
import { Arbeidsgiver } from './Arbeidsgiver';

export interface NormalarbeidstidSøknadsdata {
    fasteDager?: DurationWeekdays;
    timerPerUke?: number;
}

export interface ArbeidsforholdSøknadsdata {
    normalarbeidstid: NormalarbeidstidSøknadsdata;
    harFraværIPeriode: boolean;
}

export interface ArbeidssituasjonAnsattSøknadsdata {
    arbeidsgiver: Arbeidsgiver;
    arbeidsforhold?: ArbeidsforholdSøknadsdata;
}

export interface ArbeidssituasjonFrilansSøknadsdata {
    erFortsattFrilanser?: boolean;
    startdato: Date;
    sluttdato?: Date;
    arbeidsforhold: ArbeidsforholdSøknadsdata;
}

export interface ArbeidssituasjonSelvstendigSøknadsdata {
    startdato: Date;
    virksomhet: Virksomhet;
    arbeidsforhold: ArbeidsforholdSøknadsdata;
}

export type ArbeidsgivereArbeidssituasjonSøknadsdata = Map<string, ArbeidssituasjonAnsattSøknadsdata>;

export interface ArbeidssituasjonSøknadsdata {
    arbeidsgivere?: ArbeidsgivereArbeidssituasjonSøknadsdata;
    frilans?: ArbeidssituasjonFrilansSøknadsdata;
    selvstendig?: ArbeidssituasjonSelvstendigSøknadsdata;
}

export interface Søknadsdata {
    periode?: {
        søknadsperiode: DateRange;
    };
    arbeidssituasjon?: ArbeidssituasjonSøknadsdata;
}
