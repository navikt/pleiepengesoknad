import { ISODate } from '@navikt/sif-common-utils/lib';

export interface StønadGodtgjørelseApiData {
    mottarStønadGodtgjørelse: boolean;
    startDato?: ISODate; // dato dato fra svar eller fom fra søknadsperiode
    sluttDato?: ISODate; // dato dato fra svar eller tom fra søknadsperiode

    _mottarStønadGodtgjørelseIHelePeroden?: boolean; // feltet ignoreres av apiet
    _starterUndeveis?: boolean; // feltet ignoreres av apiet
    _slutterUnderveis?: boolean; // feltet ignoreres av apiet
}
