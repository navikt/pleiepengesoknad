import { DateRange, YesOrNo } from '@navikt/sif-common-formik/lib';
import { OmsorgstilbudSvarApi, SøknadApiData } from '../../types/søknad-api-data/SøknadApiData';
import { OmsorgstilbudSøknadsdata } from '../../types/søknadsdata/Søknadsdata';
import { getEnkeltdagerIPeriodeApiData, getFasteDagerApiData } from './tidsbrukApiUtils';

export type OmsorgstilbudApiData = Pick<SøknadApiData, 'omsorgstilbud'>;

export const getOmsorgstilbudApiDataFromSøknadsdata = (
    søknadsperiode: DateRange,
    omsorgstilbud?: OmsorgstilbudSøknadsdata
): OmsorgstilbudApiData | undefined => {
    const getOmsorgstilbudSvarApi = (erIOmsorgstilbud?: YesOrNo): OmsorgstilbudSvarApi | undefined => {
        switch (erIOmsorgstilbud) {
            case YesOrNo.YES:
                return OmsorgstilbudSvarApi.JA;
            case YesOrNo.NO:
                return OmsorgstilbudSvarApi.NEI;
            case YesOrNo.DO_NOT_KNOW:
                return OmsorgstilbudSvarApi.USIKKER;
            default:
                return undefined;
        }
    };

    if (omsorgstilbud?.type === 'erIOmsorgstilbudFasteDager') {
        return {
            omsorgstilbud: {
                erLiktHverUke: true,
                svarFortid: getOmsorgstilbudSvarApi(omsorgstilbud.erIOmsorgstilbudFortid),
                svarFremtid: getOmsorgstilbudSvarApi(omsorgstilbud.erIOmsorgstilbudFremtid),
                ukedager: getFasteDagerApiData(omsorgstilbud.fasteDager),
            },
        };
    }

    if (omsorgstilbud?.type === 'erIOmsorgstilbudEnkeltDager') {
        return {
            omsorgstilbud: {
                erLiktHverUke: false,
                svarFortid: getOmsorgstilbudSvarApi(omsorgstilbud.erIOmsorgstilbudFortid),
                svarFremtid: getOmsorgstilbudSvarApi(omsorgstilbud.erIOmsorgstilbudFremtid),
                enkeltdager: getEnkeltdagerIPeriodeApiData(omsorgstilbud.enkeltdager, søknadsperiode),
            },
        };
    }

    if (omsorgstilbud?.type === 'erIOmsorgstilbudFremtidUsikker') {
        return {
            omsorgstilbud: {
                svarFortid: omsorgstilbud.erIOmsorgstilbudFortid === YesOrNo.NO ? OmsorgstilbudSvarApi.NEI : undefined,
                svarFremtid: OmsorgstilbudSvarApi.USIKKER,
            },
        };
    }

    return undefined;
};
