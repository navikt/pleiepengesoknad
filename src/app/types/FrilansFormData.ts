import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { ISODate } from '@navikt/sif-common-utils/lib';
import { ArbeidsforholdFrilanserFormData } from './ArbeidsforholdFormData';

export enum FrilansFormField {
    erFrilanserIPerioden = 'frilans.erFrilanserIPerioden',
    fosterhjemsgodtgjørelse_mottar = 'frilans.fosterhjemsgodtgjørelse_mottar',
    fosterhjemsgodtgjørelse_harFlereOppdrag = 'frilans.fosterhjemsgodtgjørelse_harFlereOppdrag',
    startdato = 'frilans.startdato',
    sluttdato = 'frilans.sluttdato',
    erFortsattFrilanser = 'frilans.erFortsattFrilanser',
    arbeidsforhold = 'frilans.arbeidsforhold',
}

export interface FrilansFormData {
    erFrilanserIPerioden?: YesOrNo;
    fosterhjemsgodtgjørelse_mottar?: YesOrNo;
    fosterhjemsgodtgjørelse_harFlereOppdrag?: YesOrNo;
    erFortsattFrilanser?: YesOrNo;
    startdato?: ISODate;
    sluttdato?: ISODate;
    arbeidsforhold?: ArbeidsforholdFrilanserFormData;
}
