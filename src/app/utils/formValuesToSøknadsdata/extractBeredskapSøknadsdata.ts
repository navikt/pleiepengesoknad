import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { BeredskapSøknadsdata } from '../../types/søknadsdata/beredskapSøknadsdata';
import { SøknadFormData } from '../../types/SøknadFormData';
import { OmsorgstilbudSvar } from '../../types/søknad-api-data/SøknadApiData';

export const extractBeredskapSøknadsdata = ({
    harBeredskap,
    harBeredskap_ekstrainfo,
    omsorgstilbud,
}: Partial<SøknadFormData>): BeredskapSøknadsdata | undefined => {
    if (
        omsorgstilbud !== undefined &&
        (omsorgstilbud.erIOmsorgstilbud === OmsorgstilbudSvar.FAST_OG_REGELMESSIG ||
            omsorgstilbud.erIOmsorgstilbud === OmsorgstilbudSvar.DELVIS_FAST_OG_REGELMESSIG)
    ) {
        if (harBeredskap === YesOrNo.YES) {
            return {
                type: 'harBeredskap',
                harBeredskap: true,
                harBeredskap_ekstrainfo: harBeredskap_ekstrainfo,
            };
        } else {
            return {
                type: 'harIkkeBeredskap',
                harBeredskap: false,
            };
        }
    }

    return undefined;
};
