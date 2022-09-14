import { SøknadApiData } from '../../types/søknad-api-data/SøknadApiData';
import api from '../api';
import { ApiEndpointPsb } from '../endpoints';

export const sendSøknad = (data: SøknadApiData) => api.psb.post(ApiEndpointPsb.SEND_SØKNAD, data);
