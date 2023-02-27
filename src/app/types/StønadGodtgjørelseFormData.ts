import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { ISODate } from '@navikt/sif-common-utils/lib/types';

export interface StønadGodtgjørelseFormData {
    mottarStønadGodtgjørelse: YesOrNo;
    mottarStønadGodtgjørelseIHelePeroden?: YesOrNo;
    starterUndeveis?: YesOrNo;
    startDato?: ISODate;
    slutterUnderveis?: YesOrNo;
    sluttDato?: ISODate;
}

export enum StønadGodtgjørelseFormField {
    mottarStønadGodtgjørelse = 'stønadGodtgjørelse.mottarStønadGodtgjørelse',
    mottarStønadGodtgjørelseIHelePeroden = 'stønadGodtgjørelse.mottarStønadGodtgjørelseIHelePeroden',
    starterUndeveis = 'stønadGodtgjørelse.starterUndeveis',
    startDato = 'stønadGodtgjørelse.startDato',
    slutterUnderveis = 'stønadGodtgjørelse.slutterUnderveis',
    sluttDato = 'stønadGodtgjørelse.sluttDato',
}
