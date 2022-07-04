import { DateRange } from '@navikt/sif-common-formik/lib';
import { SøknadApiData } from '../../types/søknad-api-data/SøknadApiData';
import { OmsorgstilbudSøknadsdata } from '../../types/søknadsdata/Søknadsdata';
import { getEnkeltdagerIPeriodeApiData, getFasteDagerApiData } from './tidsbrukApiUtils';

export type OmsorgstilbudApiData = Pick<SøknadApiData, 'omsorgstilbud'>;
export type OmsorgstilbudUsikkerApiData = Pick<SøknadApiData, '_omsorgstilbudUsikker'>;

export const getOmsorgstilbudApiDataFromSøknadsdata = (
    søknadsperiode: DateRange,
    omsorgstilbud?: OmsorgstilbudSøknadsdata
): OmsorgstilbudApiData | OmsorgstilbudUsikkerApiData | undefined => {
    if (omsorgstilbud?.type === 'erIOmsorgstilbudFasteDager') {
        return {
            omsorgstilbud: {
                erLiktHverUke: true,
                ukedager: getFasteDagerApiData(omsorgstilbud.fasteDager),
                _usikker: omsorgstilbud.usikker,
            },
        };
    }
    if (omsorgstilbud?.type === 'erIOmsorgstilbudEnkeltDager') {
        return {
            omsorgstilbud: {
                erLiktHverUke: false,
                enkeltdager: getEnkeltdagerIPeriodeApiData(omsorgstilbud.enkeltdager, søknadsperiode),
                _usikker: omsorgstilbud.usikker,
            },
        };
    }
    if (omsorgstilbud?.type === 'erIOmsorgstilbudUsikkerFastIOmsorgstilbudNO') {
        return {
            _omsorgstilbudUsikker: true,
        };
    }
    return undefined;
};
