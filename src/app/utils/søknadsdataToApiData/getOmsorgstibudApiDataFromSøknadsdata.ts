import { DateRange } from '@navikt/sif-common-formik/lib';
import { OmsorgstilbudSvar, SøknadApiData } from '../../types/søknad-api-data/SøknadApiData';
import { OmsorgstilbudSøknadsdata } from '../../types/søknadsdata/Søknadsdata';
import { getEnkeltdagerIPeriodeApiData, getFasteDagerApiData } from './tidsbrukApiUtils';

export type OmsorgstilbudApiData = Pick<SøknadApiData, 'omsorgstilbud'>;

export const getOmsorgstilbudApiDataFromSøknadsdata = (
    søknadsperiode: DateRange,
    omsorgstilbud?: OmsorgstilbudSøknadsdata
): OmsorgstilbudApiData => {
    if (omsorgstilbud?.type === 'erIOmsorgstilbudFasteDager') {
        return {
            omsorgstilbud: {
                erLiktHverUke: true,
                ukedager: getFasteDagerApiData(omsorgstilbud.fasteDager),
                svar: omsorgstilbud.usikker === true ? OmsorgstilbudSvar.USIKKER : OmsorgstilbudSvar.JA,
            },
        };
    }
    if (omsorgstilbud?.type === 'erIOmsorgstilbudEnkeltDager') {
        return {
            omsorgstilbud: {
                erLiktHverUke: false,
                enkeltdager: getEnkeltdagerIPeriodeApiData(omsorgstilbud.enkeltdager, søknadsperiode),
                svar: omsorgstilbud.usikker === true ? OmsorgstilbudSvar.USIKKER : OmsorgstilbudSvar.JA,
            },
        };
    }
    if (omsorgstilbud?.type === 'erIOmsorgstilbudUsikkerFastIOmsorgstilbudNO') {
        return {
            omsorgstilbud: {
                svar: OmsorgstilbudSvar.USIKKER,
            },
        };
    }
    return {
        omsorgstilbud: {
            svar: OmsorgstilbudSvar.NEI,
        },
    };
};
