import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { NattevåkSøknadsdata } from '../../types/søknadsdata/nattevåkSøknadsdata';
import { SøknadFormValues } from '../../types/SøknadFormValues';

export const extractNattevåkSøknadsdata = ({
    harNattevåk,
    harNattevåk_ekstrainfo,
    omsorgstilbud,
}: Partial<SøknadFormValues>): NattevåkSøknadsdata | undefined => {
    if (omsorgstilbud !== undefined && omsorgstilbud.erIOmsorgstilbud === YesOrNo.YES) {
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
