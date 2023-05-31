import { SøknadApiData } from '../../types/søknad-api-data/SøknadApiData';
import { StønadGodtgjørelseSøknadsdata } from '../../types/søknadsdata/stønadGodtgjørelseSøknadsdata';
import { DateRange, YesOrNo } from '@navikt/sif-common-formik-ds/lib';
import { dateToISODate } from '@navikt/sif-common-utils';

type StønadGodtgjørelseApiData = Pick<SøknadApiData, 'stønadGodtgjørelse'>;

export const getStønadGodtgjørelseApiDataFromSøknadsdata = (
    søknadsperiode: DateRange,
    stønadGodtgjørelse?: StønadGodtgjørelseSøknadsdata
): StønadGodtgjørelseApiData => {
    if (stønadGodtgjørelse === undefined) {
        throw Error('stønadGodtgjørelse undefined');
    }
    const fraOgMed = dateToISODate(søknadsperiode.from);
    const tilOgMed = dateToISODate(søknadsperiode.to);

    switch (stønadGodtgjørelse?.type) {
        case 'mottarIkke':
            return {
                stønadGodtgjørelse: {
                    mottarStønadGodtgjørelse: false,
                },
            };

        case 'mottarIHelePeroden':
            return {
                stønadGodtgjørelse: {
                    mottarStønadGodtgjørelse: true,
                    _mottarStønadGodtgjørelseIHelePeroden: true,
                    startdato: fraOgMed,
                    sluttdato: tilOgMed,
                },
            };

        case 'mottarIDelerAvPeroden':
            const { starterUndeveis, startdato, slutterUnderveis, sluttdato } = stønadGodtgjørelse;
            return {
                stønadGodtgjørelse: {
                    mottarStønadGodtgjørelse: true,
                    _mottarStønadGodtgjørelseIHelePeroden: false,

                    _starterUndeveis: starterUndeveis === YesOrNo.YES ? true : false,
                    startdato: starterUndeveis === YesOrNo.YES ? startdato : fraOgMed,

                    _slutterUnderveis: slutterUnderveis === YesOrNo.YES ? true : false,
                    sluttdato: slutterUnderveis === YesOrNo.YES ? sluttdato : tilOgMed,
                },
            };
    }
};
