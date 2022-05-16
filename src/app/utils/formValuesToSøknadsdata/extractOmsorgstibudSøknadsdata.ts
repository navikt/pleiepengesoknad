import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { OmsorgstilbudFormData } from '../../types/SøknadFormData';
import { OmsorgstilbudSøknadsdata } from '../../types/søknadsdata/Søknadsdata';
import appSentryLogger from '../appSentryLogger';

export const extractOmsorgstibudSøknadsdata = (
    søknadsperiode: DateRange,
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

    /** Logge return av undefined selv om erIOmsorgstilbud er definert */
    const payload = {
        omsorgstilbud,
        søknadsperiode,
    };
    appSentryLogger.logError('Ugyldig omsorgstilbud informasjon', JSON.stringify(payload));

    return undefined;
};
