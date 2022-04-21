import { NattevåkSøknadsdata } from '../../types/søknadsdata/nattevåkSøknadsdata';
import { SøknadApiData } from '../../types/søknad-api-data/SøknadApiData';

type NattevåkApiData = Pick<SøknadApiData, 'nattevåk'>;

export const getNattevåkApiDataFromSøknadsdata = (nattevåk?: NattevåkSøknadsdata): NattevåkApiData | undefined => {
    switch (nattevåk?.type) {
        case 'harNattevåk':
            return {
                nattevåk: {
                    harNattevåk: nattevåk.harNattevåk,
                    tilleggsinformasjon: nattevåk.harNattevåk_ekstrainfo,
                },
            };
        case 'harIkkeNattevåk':
            return {
                nattevåk: {
                    harNattevåk: nattevåk.harNattevåk,
                },
            };
        default:
            return undefined;
    }
};
