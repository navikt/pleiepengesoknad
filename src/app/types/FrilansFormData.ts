import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { ISODate } from '@navikt/sif-common-utils/lib';
import { ArbeidsforholdFrilanserFormData } from './ArbeidsforholdFormData';

export enum FrilansFormField {
    harHattInntektSomFrilanser = 'frilans.harHattInntektSomFrilanser',
    startdato = 'frilans.startdato',
    sluttdato = 'frilans.sluttdato',
    erFortsattFrilanser = 'frilans.erFortsattFrilanser',
    arbeidsforhold = 'frilans.arbeidsforhold',
}

export interface FrilansFormData {
    harHattInntektSomFrilanser?: YesOrNo;
    erFortsattFrilanser?: YesOrNo;
    startdato?: ISODate;
    sluttdato?: ISODate;
    arbeidsforhold?: ArbeidsforholdFrilanserFormData;
}
