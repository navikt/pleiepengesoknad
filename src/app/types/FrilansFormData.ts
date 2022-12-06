import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { ISODate } from '@navikt/sif-common-utils/lib';
import { ArbeidsforholdFrilanserFormValues } from './ArbeidsforholdFormValues';

export enum FrilansTyper {
    FRILANS = 'FRILANS',
    OMSORGSSTØNAD = 'OMSORGSSTØNAD',
    STYREVERV = 'STYREVERV',
}

export enum FrilansFormField {
    harHattInntektSomFrilanser = 'frilans.harHattInntektSomFrilanser',
    frilansTyper = 'frilans.frilansTyper',
    misterHonorar = 'frilans.misterHonorar',
    startdato = 'frilans.startdato',
    sluttdato = 'frilans.sluttdato',
    erFortsattFrilanser = 'frilans.erFortsattFrilanser',
    arbeidsforhold = 'frilans.arbeidsforhold',
}

export interface FrilansFormData {
    harHattInntektSomFrilanser?: YesOrNo;
    frilansTyper?: FrilansTyper[];
    misterHonorar?: YesOrNo;
    erFortsattFrilanser?: YesOrNo;
    startdato?: ISODate;
    sluttdato?: ISODate;
    arbeidsforhold?: ArbeidsforholdFrilanserFormValues;
}
