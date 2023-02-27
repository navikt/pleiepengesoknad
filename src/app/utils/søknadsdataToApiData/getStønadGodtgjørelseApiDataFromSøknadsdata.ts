import { SøknadApiData } from '../../types/søknad-api-data/SøknadApiData';
import { StønadGodtgjørelseSøknadsdata } from '../../types/søknadsdata/stønadGodtgjørelseSøknadsdata';
import { YesOrNo } from '@navikt/sif-common-formik/lib';

type StønadGodtgjørelseApiData = Pick<SøknadApiData, 'stønadGodtgjørelse'>;

export const getStønadGodtgjørelseApiDataFromSøknadsdata = (
    stønadGodtgjørelse?: StønadGodtgjørelseSøknadsdata
): StønadGodtgjørelseApiData => {
    if (stønadGodtgjørelse === undefined) {
        throw Error('stønadGodtgjørelse undefined');
    }

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
                    mottarStønadGodtgjørelseIHelePeroden: true,
                },
            };

        case 'mottarIDelerAvPeroden':
            const { starterUndeveis, startDato, slutterUnderveis, sluttDato } = stønadGodtgjørelse;
            return {
                stønadGodtgjørelse: {
                    mottarStønadGodtgjørelse: true,
                    mottarStønadGodtgjørelseIHelePeroden: false,
                    starterUndeveis: starterUndeveis === YesOrNo.YES ? true : false,
                    startDato: stønadGodtgjørelse.starterUndeveis === YesOrNo.YES ? startDato : undefined,
                    slutterUnderveis: stønadGodtgjørelse.slutterUnderveis === YesOrNo.YES ? true : false,
                    sluttDato: slutterUnderveis === YesOrNo.YES ? sluttDato : undefined,
                },
            };
    }
};
