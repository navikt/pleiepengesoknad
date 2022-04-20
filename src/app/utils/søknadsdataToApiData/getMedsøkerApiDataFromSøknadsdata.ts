import { SøknadApiData } from 'app/types/søknad-api-data/SøknadApiData';
import { MedsøkerSøknadsdata } from '../../types/søknadsdata/Søknadsdata';

export type MedsøkerApiData = Pick<SøknadApiData, 'harMedsøker' | 'samtidigHjemme'>;

export const getMedsøkerApiDataFromSøknadsdata = (medsøker?: MedsøkerSøknadsdata): MedsøkerApiData => {
    if (medsøker?.type === 'harMedsøker') {
        return {
            harMedsøker: medsøker.harMedsøker,
            samtidigHjemme: medsøker.samtidigHjemme,
        };
    } else {
        return {
            harMedsøker: false,
        };
    }
};
