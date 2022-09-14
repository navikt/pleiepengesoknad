import { failure, RemoteData, success } from '@devexperts/remote-data-ts';
import { AxiosError } from 'axios';
import { InnsendtSøknad } from '../../types/InnsendtSøknad';
import { Feature, isFeatureEnabled } from '../../utils/featureToggleUtils';
import api from '../api';
import { ApiEndpointInnsyn } from '../endpoints';

const forrigeSøknadEndpoint = {
    fetch: async (): Promise<RemoteData<AxiosError, InnsendtSøknad | undefined>> => {
        try {
            if (isFeatureEnabled(Feature.PREUTFYLLING) == false) {
                return Promise.resolve(success(undefined));
            }
            const result = await api.innsyn.get<InnsendtSøknad>(ApiEndpointInnsyn.FORRIGE_SØKNAD);
            return Promise.resolve(success(result.data ? result.data : undefined));
        } catch (error) {
            return Promise.reject(failure(error));
        }
    },
};

export default forrigeSøknadEndpoint;
