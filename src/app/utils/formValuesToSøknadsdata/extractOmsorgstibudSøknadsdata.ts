import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { OmsorgstilbudFormData } from '../../types/SøknadFormData';
import { OmsorgstilbudSøknadsdata } from '../../types/søknadsdata/Søknadsdata';
import appSentryLogger from '../appSentryLogger';

export const extractOmsorgstibudSøknadsdata = (
    søknadsperiode: DateRange,
    omsorgstilbud?: OmsorgstilbudFormData
): OmsorgstilbudSøknadsdata | undefined => {
    if (
        !omsorgstilbud ||
        omsorgstilbud.erIOmsorgstilbud === YesOrNo.NO ||
        omsorgstilbud.erIOmsorgstilbud === YesOrNo.UNANSWERED
    ) {
        return undefined;
    }

    if (omsorgstilbud.erIOmsorgstilbud === YesOrNo.DO_NOT_KNOW && omsorgstilbud.fastIOmsorgstilbud === YesOrNo.NO) {
        return {
            type: 'erIOmsorgstilbudUsikkerFastIOmsorgstilbudNO',
        };
    }

    const { erLiktHverUke, fasteDager, enkeltdager } = omsorgstilbud;

    if (erLiktHverUke === YesOrNo.YES && fasteDager) {
        return {
            type: 'erIOmsorgstilbudFasteDager',
            usikker: omsorgstilbud.erIOmsorgstilbud === YesOrNo.DO_NOT_KNOW,
            fasteDager: fasteDager,
        };
    }
    if (erLiktHverUke !== YesOrNo.YES && enkeltdager) {
        return {
            type: 'erIOmsorgstilbudEnkeltDager',
            usikker: omsorgstilbud.erIOmsorgstilbud === YesOrNo.DO_NOT_KNOW,
            enkeltdager: enkeltdager,
        };
    }

    /** Logge return av undefined selv om erIOmsorgstilbud er definert */
    const payload = {
        omsorgstilbud,
        søknadsperiode,
    };
    appSentryLogger.logError('Ugyldig omsorgstilbud informasjon', JSON.stringify(payload));

    return undefined;
};
