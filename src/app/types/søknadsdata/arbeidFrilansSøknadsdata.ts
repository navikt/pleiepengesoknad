import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { DateRange } from '@navikt/sif-common-utils/lib';
import { FrilansType } from '../FrilansFormData';
import { ArbeidsforholdSøknadsdata } from './arbeidsforholdSøknadsdata';

export interface ArbeidFrilansSøknadsdataErIkkeFrilanser {
    type: 'erIkkeFrilanser';
    erFrilanser: false;
}
export interface ArbeidFrilansSøknadsdataPågående {
    type: 'pågående';
    erFrilanser: true;
    frilansType: FrilansType[];
    misterHonorar?: YesOrNo;
    startdato: Date;
    aktivPeriode: DateRange;
    arbeidsforhold: ArbeidsforholdSøknadsdata;
}

export interface ArbeidFrilansKunStyrevervSøknadsdataPågående {
    type: 'pågåendeKunStyreverv';
    erFrilanser: true;
    frilansType: [FrilansType.STYREVERV];
    misterHonorar: YesOrNo.NO;
}

export type ArbeidFrilansSøknadsdata =
    | ArbeidFrilansSøknadsdataErIkkeFrilanser
    | ArbeidFrilansSøknadsdataPågående
    | ArbeidFrilansKunStyrevervSøknadsdataPågående;
