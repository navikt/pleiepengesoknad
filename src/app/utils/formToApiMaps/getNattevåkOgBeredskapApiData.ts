import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { SøknadApiData } from '../../types/søknad-api-data/SøknadApiData';
import { SøknadFormData } from '../../types/SøknadFormData';
import { skalBrukerSvarePåBeredskapOgNattevåk } from '../stepUtils';

type NattevåkOgBeredskapApiData = Pick<SøknadApiData, 'nattevåk' | 'beredskap'>;

export const getNattevåkOgBeredskapApiData = (formData: SøknadFormData): NattevåkOgBeredskapApiData | undefined => {
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
