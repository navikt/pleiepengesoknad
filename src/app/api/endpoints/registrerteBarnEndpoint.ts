import { failure, RemoteData, success } from '@devexperts/remote-data-ts';
import { AxiosError } from 'axios';
import { isObject, isString } from 'formik';
import { RegistrertBarn } from '../../types';
import { isStringOrNull, isStringOrUndefined } from '../../utils/typeGuardUtilities';
import api from '../api';
import { ApiEndpointPsb } from '../endpoints';

type RegistrertBarnResponse = {
    barn: RegistrertBarn[];
};

export const isValidBarn = (response: any): response is RegistrertBarn => {
    if (
        isObject(response) &&
        isString(response.aktørId) &&
        isString(response.fødselsdato) &&
        isString(response.fødselsnummer) &&
        isStringOrNull(response.fornavn) &&
        isStringOrNull(response.etternavn) &&
        isStringOrUndefined(response.mellomnavn)
    ) {
        return true;
    } else {
        return false;
    }
};

export const isValidBarnResponse = (data: RegistrertBarnResponse): boolean => {
    if (Array.isArray(data?.barn) === false || data.barn.some((barn) => isValidBarn(barn) === false)) {
        return false;
    }
    return true;
};

const registrerteBarnEndpoint = {
    fetch: async (): Promise<RemoteData<AxiosError, RegistrertBarn[]>> => {
        try {
            const { data } = await api.psb.get<RegistrertBarnResponse>(ApiEndpointPsb.BARN);
            if (isValidBarnResponse(data) === false) {
                return Promise.reject('Invalid barn response');
            }
            return Promise.resolve(success(data.barn));
        } catch (error) {
            return Promise.reject(failure(error));
        }
    },
};
export default registrerteBarnEndpoint;
