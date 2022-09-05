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
                svar: omsorgstilbud.svar,
            },
        };
    }
    if (
        omsorgstilbud?.type === 'erIOmsorgstilbudEnkeltDager' ||
        omsorgstilbud?.type === 'erIOmsorgstilbudDelvisEnkeltDager'
    ) {
        return {
            omsorgstilbud: {
                erLiktHverUke: false,
                enkeltdager: getEnkeltdagerIPeriodeApiData(omsorgstilbud.enkeltdager, søknadsperiode),
                svar: omsorgstilbud.svar,
            },
        };
    }
    if (omsorgstilbud?.type === 'erIkkeFastOgRegelmessig') {
        return {
            omsorgstilbud: {
                svar: omsorgstilbud.svar,
            },
        };
    }
    return {
        omsorgstilbud: {
            svar: OmsorgstilbudSvar.IKKE_OMSORGSTILBUD,
        },
    };
};
