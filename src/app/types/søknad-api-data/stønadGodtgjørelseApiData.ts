import { ISODate } from '@navikt/sif-common-utils/lib';

export interface StønadGodtgjørelseApiData {
    mottarStønadGodtgjørelse: boolean;
    mottarStønadGodtgjørelseIHelePeroden?: boolean;
    starterUndeveis?: boolean;
    startDato?: ISODate;
    slutterUnderveis?: boolean;
    sluttDato?: ISODate;
}
