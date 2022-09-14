import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { OmsorgstilbudFormData } from '../../types/SøknadFormValues';
import { OmsorgstilbudSøknadsdata } from '../../types/søknadsdata/Søknadsdata';

export const extractOmsorgstibudSøknadsdata = (
    omsorgstilbud?: OmsorgstilbudFormData
): OmsorgstilbudSøknadsdata | undefined => {
    if (!omsorgstilbud || omsorgstilbud.erIOmsorgstilbud !== YesOrNo.YES) {
        return undefined;
    }

    const { erLiktHverUke, fasteDager, enkeltdager } = omsorgstilbud;

    if (erLiktHverUke === YesOrNo.YES && fasteDager) {
        return {
            type: 'erIOmsorgstilbudFasteDager',
            fasteDager: fasteDager,
        };
    }
    if (erLiktHverUke !== YesOrNo.YES && enkeltdager) {
        return {
            type: 'erIOmsorgstilbudEnkeltDager',
            enkeltdager: enkeltdager,
        };
    }
    return undefined;
};
