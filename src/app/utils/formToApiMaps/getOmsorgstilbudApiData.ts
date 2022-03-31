import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { OmsorgstilbudApiData, SøknadApiData } from '../../types/SøknadApiData';
import { OmsorgstilbudFormData } from '../../types/SøknadFormData';
import appSentryLogger from '../appSentryLogger';
import { getEnkeltdagerIPeriodeApiData, getFasteDagerApiData } from './tidsbrukApiUtils';

type OmsorgstilbudApiDataPart = Pick<SøknadApiData, 'omsorgstilbud'>;

export const mapOmsorgstilbudToApiData = (
    omsorgstilbud: OmsorgstilbudFormData | undefined,
    søknadsperiode: DateRange
): OmsorgstilbudApiData | undefined => {
    if (!omsorgstilbud || omsorgstilbud.erIOmsorgstilbud !== YesOrNo.YES) {
        return undefined;
    }
    const { fasteDager, enkeltdager, erLiktHverUke } = omsorgstilbud;
    if (erLiktHverUke === YesOrNo.YES && fasteDager) {
        return {
            erLiktHverUke: true,
            ukedager: getFasteDagerApiData(fasteDager),
        };
    }
    if (erLiktHverUke !== YesOrNo.YES && enkeltdager) {
        return {
            erLiktHverUke: false,
            enkeltdager: getEnkeltdagerIPeriodeApiData(enkeltdager, søknadsperiode),
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

export const getOmsorgstilbudApiData = (
    omsorgstilbud: OmsorgstilbudFormData | undefined,
    søknadsperiode: DateRange
): OmsorgstilbudApiDataPart => {
    return {
        omsorgstilbud: mapOmsorgstilbudToApiData(omsorgstilbud, søknadsperiode),
    };
};
