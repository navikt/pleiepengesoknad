import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { OmsorgstilbudFormData } from '../../types/SøknadFormData';
import { OmsorgstilbudSøknadsdata } from '../../types/søknadsdata/Søknadsdata';

export const extractOmsorgstibudSøknadsdata = (
    omsorgstilbud?: OmsorgstilbudFormData
): OmsorgstilbudSøknadsdata | undefined => {
    console.log('omsorgstilbud: ', omsorgstilbud);
    if (
        !omsorgstilbud ||
        (omsorgstilbud.erIOmsorgstilbudFortid !== YesOrNo.YES &&
            (omsorgstilbud.erIOmsorgstilbudFremtid === YesOrNo.NO ||
                omsorgstilbud.erIOmsorgstilbudFremtid === undefined))
    ) {
        return undefined;
    }

    const { erLiktHverUke, fasteDager, enkeltdager, erIOmsorgstilbudFortid, erIOmsorgstilbudFremtid } = omsorgstilbud;

    if (erLiktHverUke === YesOrNo.YES && fasteDager) {
        return {
            type: 'erIOmsorgstilbudFasteDager',
            erIOmsorgstilbudFortid: erIOmsorgstilbudFortid,
            erIOmsorgstilbudFremtid: erIOmsorgstilbudFremtid,
            fasteDager: fasteDager,
        };
    }
    if (erLiktHverUke !== YesOrNo.YES && enkeltdager) {
        return {
            type: 'erIOmsorgstilbudEnkeltDager',
            erIOmsorgstilbudFortid: erIOmsorgstilbudFortid,
            erIOmsorgstilbudFremtid: erIOmsorgstilbudFremtid,
            enkeltdager: enkeltdager,
        };
    }

    if (
        erIOmsorgstilbudFremtid === YesOrNo.DO_NOT_KNOW &&
        (erIOmsorgstilbudFortid === undefined || erIOmsorgstilbudFortid === YesOrNo.NO)
    ) {
        return {
            type: 'erIOmsorgstilbudFremtidUsikker',
            erIOmsorgstilbudFortid: erIOmsorgstilbudFortid,
        };
    }

    return undefined;
};
