import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { StønadGodtgjørelseSøknadsdata } from '../../types/søknadsdata/stønadGodtgjørelseSøknadsdata';
import { StønadGodtgjørelseFormData } from '../../types/StønadGodtgjørelseFormData';

export const extractStønadGodtgjørelseSøknadsdata = (
    stønadGodtgjørelse: StønadGodtgjørelseFormData
): StønadGodtgjørelseSøknadsdata | undefined => {
    const {
        mottarStønadGodtgjørelse,
        mottarStønadGodtgjørelseIHelePeroden,
        starterUndeveis,
        startDato,
        slutterUnderveis,
        sluttDato,
    } = stønadGodtgjørelse;
    if (mottarStønadGodtgjørelse === YesOrNo.NO) {
        return {
            type: 'mottarIkke',
            mottarStønadGodtgjørelse,
        };
    }

    if (mottarStønadGodtgjørelse === YesOrNo.YES) {
        if (mottarStønadGodtgjørelseIHelePeroden === YesOrNo.YES) {
            return {
                type: 'mottarIHelePeroden',
                mottarStønadGodtgjørelse: YesOrNo.YES,
                mottarStønadGodtgjørelseIHelePeroden: YesOrNo.YES,
            };
        }
        if (mottarStønadGodtgjørelseIHelePeroden === YesOrNo.NO && starterUndeveis && slutterUnderveis) {
            return {
                type: 'mottarIDelerAvPeroden',
                mottarStønadGodtgjørelse: YesOrNo.YES,
                mottarStønadGodtgjørelseIHelePeroden: YesOrNo.NO,
                starterUndeveis,
                startDato: starterUndeveis === YesOrNo.YES ? startDato : undefined,
                slutterUnderveis,
                sluttDato: slutterUnderveis === YesOrNo.YES ? sluttDato : undefined,
            };
        }
    }

    return undefined;
};
