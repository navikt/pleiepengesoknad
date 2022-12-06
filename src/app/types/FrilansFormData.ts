import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { ISODate } from '@navikt/sif-common-utils/lib';
import { ArbeidsforholdFrilanserFormValues } from './ArbeidsforholdFormValues';

export enum FrilansType {
    FRILANS = 'FRILANS',
    OMSORGSSTØNAD = 'OMSORGSSTØNAD',
    STYREVERV = 'STYREVERV',
}

export enum FrilansFormField {
    harHattInntektSomFrilanser = 'frilans.harHattInntektSomFrilanser',
    frilansType = 'frilans.frilansType',
    misterHonorar = 'frilans.misterHonorar',
    startdato = 'frilans.startdato',
    sluttdato = 'frilans.sluttdato',
    erFortsattFrilanser = 'frilans.erFortsattFrilanser',
    arbeidsforhold = 'frilans.arbeidsforhold',
}

export interface FrilansFormData {
    harHattInntektSomFrilanser?: YesOrNo;
    frilansType?: FrilansType[];
    misterHonorar?: YesOrNo;
    erFortsattFrilanser?: YesOrNo;
    startdato?: ISODate;
    sluttdato?: ISODate;
    arbeidsforhold?: ArbeidsforholdFrilanserFormValues;
}
