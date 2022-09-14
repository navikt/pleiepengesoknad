import { DateRange, YesOrNo } from '@navikt/sif-common-formik/lib';
import { SøknadApiData } from '../../types/søknad-api-data/SøknadApiData';
import { OmsorgstilbudSøknadsdata } from '../../types/søknadsdata/Søknadsdata';
import { getEnkeltdagerIPeriodeApiData, getFasteDagerApiData } from './tidsbrukApiUtils';

export type OmsorgstilbudApiData = Pick<SøknadApiData, 'omsorgstilbud'>;

export const getOmsorgstilbudApiDataFromSøknadsdata = (
    søknadsperiode: DateRange,
    omsorgstilbud?: OmsorgstilbudSøknadsdata
): OmsorgstilbudApiData | undefined => {
    const getErIOmsorgstilbudApi = (erIOmsorgstilbud?: YesOrNo) =>
        erIOmsorgstilbud
            ? erIOmsorgstilbud === YesOrNo.YES
                ? true
                : erIOmsorgstilbud === YesOrNo.NO
                ? false
                : undefined
            : undefined;

    if (omsorgstilbud?.type === 'erIOmsorgstilbudFasteDager') {
        return {
            omsorgstilbud: {
                erLiktHverUke: true,
                erIOmsorgstilbudFortidApi: getErIOmsorgstilbudApi(omsorgstilbud.erIOmsorgstilbudFortid),
                erIOmsorgstilbudFremtidApi: getErIOmsorgstilbudApi(omsorgstilbud.erIOmsorgstilbudFremtid),
                erIOmsorgstilbudFremtidUsikkerApi:
                    omsorgstilbud.erIOmsorgstilbudFremtid === YesOrNo.DO_NOT_KNOW ? true : undefined,
                ukedager: getFasteDagerApiData(omsorgstilbud.fasteDager),
            },
        };
    }

    if (omsorgstilbud?.type === 'erIOmsorgstilbudEnkeltDager') {
        return {
            omsorgstilbud: {
                erLiktHverUke: false,
                erIOmsorgstilbudFortidApi: getErIOmsorgstilbudApi(omsorgstilbud.erIOmsorgstilbudFortid),
                erIOmsorgstilbudFremtidApi: getErIOmsorgstilbudApi(omsorgstilbud.erIOmsorgstilbudFremtid),
                erIOmsorgstilbudFremtidUsikkerApi:
                    omsorgstilbud.erIOmsorgstilbudFremtid === YesOrNo.DO_NOT_KNOW ? true : undefined,

                enkeltdager: getEnkeltdagerIPeriodeApiData(omsorgstilbud.enkeltdager, søknadsperiode),
            },
        };
    }

    if (omsorgstilbud?.type === 'erIOmsorgstilbudFremtidUsikker') {
        return {
            omsorgstilbud: {
                erIOmsorgstilbudFremtidUsikkerApi: true,
            },
        };
    }

    return undefined;
};
