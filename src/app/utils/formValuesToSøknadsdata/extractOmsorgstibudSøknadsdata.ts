import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { OmsorgstilbudSvar } from '../../types/søknad-api-data/SøknadApiData';
import { OmsorgstilbudFormData } from '../../types/SøknadFormData';
import { OmsorgstilbudSøknadsdata } from '../../types/søknadsdata/Søknadsdata';
import appSentryLogger from '../appSentryLogger';

export const extractOmsorgstibudSøknadsdata = (
    søknadsperiode: DateRange,
    omsorgstilbud?: OmsorgstilbudFormData
): OmsorgstilbudSøknadsdata | undefined => {
    if (!omsorgstilbud || omsorgstilbud.erIOmsorgstilbud === OmsorgstilbudSvar.IKKE_OMSORGSTILBUD) {
        return undefined;
    }

    if (omsorgstilbud.erIOmsorgstilbud === OmsorgstilbudSvar.IKKE_FAST_OG_REGELMESSIG) {
        return { type: 'erIkkeFastOgRegelmessig', svar: OmsorgstilbudSvar.IKKE_FAST_OG_REGELMESSIG };
    }

    const { erLiktHverUke, fasteDager, enkeltdager } = omsorgstilbud;

    if (omsorgstilbud.erIOmsorgstilbud === OmsorgstilbudSvar.DELVIS_FAST_OG_REGELMESSIG && enkeltdager) {
        return {
            type: 'erIOmsorgstilbudDelvisEnkeltDager',
            svar: OmsorgstilbudSvar.DELVIS_FAST_OG_REGELMESSIG,
            enkeltdager: enkeltdager,
        };
    }

    if (erLiktHverUke === YesOrNo.YES && fasteDager) {
        return {
            type: 'erIOmsorgstilbudFasteDager',
            svar: OmsorgstilbudSvar.FAST_OG_REGELMESSIG,
            fasteDager: fasteDager,
        };
    }
    if (erLiktHverUke !== YesOrNo.YES && enkeltdager) {
        return {
            type: 'erIOmsorgstilbudEnkeltDager',
            svar: OmsorgstilbudSvar.FAST_OG_REGELMESSIG,
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
