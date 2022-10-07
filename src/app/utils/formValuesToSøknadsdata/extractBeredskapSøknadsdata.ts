import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { BeredskapSøknadsdata } from '../../types/søknadsdata/beredskapSøknadsdata';
import { SøknadFormData } from '../../types/SøknadFormData';

export const extractBeredskapSøknadsdata = ({
    harBeredskap,
    harBeredskap_ekstrainfo,
    omsorgstilbud,
}: Partial<SøknadFormData>): BeredskapSøknadsdata | undefined => {
    if (
        omsorgstilbud !== undefined &&
        (omsorgstilbud.erIOmsorgstilbudFortid === YesOrNo.YES || omsorgstilbud?.erIOmsorgstilbudFremtid === YesOrNo.YES)
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
