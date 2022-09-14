import { failure, RemoteData, success } from '@devexperts/remote-data-ts';
import { AxiosError } from 'axios';
import { Søker } from '../../types/Søker';
import api from '../api';
import { ApiEndpointPsb } from '../endpoints';

const søkerEndpoint = {
    fetch: async (): Promise<RemoteData<AxiosError, Søker>> => {
        try {
            const { data } = await api.psb.get<Søker>(ApiEndpointPsb.SØKER);
            return Promise.resolve(success(data));
        } catch (error) {
            return Promise.reject(failure(error));
        }
    },
};

export default søkerEndpoint;
