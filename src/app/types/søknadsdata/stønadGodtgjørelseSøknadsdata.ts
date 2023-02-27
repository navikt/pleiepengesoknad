import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { ISODate } from '@navikt/sif-common-utils/lib';

export interface MottarIkkeStønadGodtgjørelse {
    type: 'mottarIkke';
    mottarStønadGodtgjørelse: YesOrNo.NO;
}

export interface MottarStønadGodtgjørelseIHelePeroden {
    type: 'mottarIHelePeroden';
    mottarStønadGodtgjørelse: YesOrNo.YES;
    mottarStønadGodtgjørelseIHelePeroden: YesOrNo.YES;
}

export interface MottarStønadGodtgjørelseIDelerAvPeroden {
    type: 'mottarIDelerAvPeroden';
    mottarStønadGodtgjørelse: YesOrNo.YES;
    mottarStønadGodtgjørelseIHelePeroden: YesOrNo.NO;
    starterUndeveis: YesOrNo;
    startDato?: ISODate;
    slutterUnderveis: YesOrNo;
    sluttDato?: ISODate;
}

export type StønadGodtgjørelseSøknadsdata =
    | MottarStønadGodtgjørelseIHelePeroden
    | MottarIkkeStønadGodtgjørelse
    | MottarStønadGodtgjørelseIDelerAvPeroden;
