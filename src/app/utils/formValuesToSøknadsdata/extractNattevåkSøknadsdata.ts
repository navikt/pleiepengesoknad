import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { NattevåkSøknadsdata } from '../../types/søknadsdata/nattevåkSøknadsdata';
import { SøknadFormData } from '../../types/SøknadFormData';
import { OmsorgstilbudSvar } from '../../types/søknad-api-data/SøknadApiData';

export const extractNattevåkSøknadsdata = ({
    harNattevåk,
    harNattevåk_ekstrainfo,
    omsorgstilbud,
}: Partial<SøknadFormData>): NattevåkSøknadsdata | undefined => {
    if (
        omsorgstilbud !== undefined &&
        (omsorgstilbud.erIOmsorgstilbud === OmsorgstilbudSvar.FAST_OG_REGELMESSIG ||
            omsorgstilbud.erIOmsorgstilbud === OmsorgstilbudSvar.DELVIS_FAST_OG_REGELMESSIG)
    ) {
        if (harNattevåk === YesOrNo.YES) {
            return {
                type: 'harNattevåk',
                harNattevåk: true,
                harNattevåk_ekstrainfo: harNattevåk_ekstrainfo,
            };
        } else {
            return {
                type: 'harIkkeNattevåk',
                harNattevåk: false,
            };
        }
    }

    return undefined;
};
