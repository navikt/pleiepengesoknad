import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { PleiepengesøknadApiData } from '../../types/PleiepengesøknadApiData';
import { PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { skalBrukerSvarePåBeredskapOgNattevåk } from '../stepUtils';

type NattevåkOgBeredskapApiData = Pick<PleiepengesøknadApiData, 'nattevåk' | 'beredskap'>;

export const getNattevåkOgBeredskapApiData = (
    formData: PleiepengesøknadFormData
): NattevåkOgBeredskapApiData | undefined => {
    const inkluderNattevåkOgBeredskap = skalBrukerSvarePåBeredskapOgNattevåk(formData);
    if (inkluderNattevåkOgBeredskap) {
        const { harNattevåk, harNattevåk_ekstrainfo, harBeredskap, harBeredskap_ekstrainfo } = formData;
        return {
            nattevåk: {
                harNattevåk: harNattevåk === YesOrNo.YES,
                tilleggsinformasjon: harNattevåk_ekstrainfo,
            },
            beredskap: {
                beredskap: harBeredskap === YesOrNo.YES,
                tilleggsinformasjon: harBeredskap_ekstrainfo,
            },
        };
    }
    return undefined;
};
