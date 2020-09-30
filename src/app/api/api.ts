import axios, { AxiosError, AxiosResponse } from 'axios';
import axiosConfig from '../config/axiosConfig';
import { StepID } from '../config/stepConfig';
import { PleiepengesøknadApiData } from '../types/PleiepengesøknadApiData';
import { PleiepengesøknadFormData } from '../types/PleiepengesøknadFormData';
import { ResourceType } from '../types/ResourceType';
import { MELLOMLAGRING_VERSION, MellomlagringData } from '../types/storage';
import { getApiUrlByResourceType, isForbidden, isUnauthorized, sendMultipartPostRequest } from '../utils/apiUtils';
import { storageParser } from '../utils/parser';
import { redirectToLoginPage } from '../utils/navigationUtils';
import { Arbeidsgiver } from '../types/ArbeidsgiverResponse';

export const persist = (formData: PleiepengesøknadFormData, lastStepID: StepID): void => {
    const body: MellomlagringData = { formData, metadata: { lastStepID, version: MELLOMLAGRING_VERSION } };
    const url = `${getApiUrlByResourceType(ResourceType.MELLOMLAGRING)}?lastStepID=${encodeURI(lastStepID)}`;
    axios.post(url, { ...body }, axiosConfig);
};
export const rehydrate = () =>
    axios.get(getApiUrlByResourceType(ResourceType.MELLOMLAGRING), {
        ...axiosConfig,
        transformResponse: storageParser,
    });
export const purge = () =>
    axios.delete(getApiUrlByResourceType(ResourceType.MELLOMLAGRING), { ...axiosConfig, data: {} });

export const getBarn = () => axios.get(getApiUrlByResourceType(ResourceType.BARN), axiosConfig);
export const getSøker = () => axios.get(getApiUrlByResourceType(ResourceType.SØKER), axiosConfig);
export const getArbeidsgiver = (fom: string, tom: string): Promise<AxiosResponse<{ organisasjoner: Arbeidsgiver[] }>> =>
    axios.get(`${getApiUrlByResourceType(ResourceType.ARBEIDSGIVER)}?fra_og_med=${fom}&til_og_med=${tom}`, axiosConfig);

export const sendApplication = (data: PleiepengesøknadApiData) =>
    axios.post(getApiUrlByResourceType(ResourceType.SEND_SØKNAD), data, axiosConfig);

export const uploadFile = (file: File) => {
    const formData = new FormData();
    formData.append('vedlegg', file);
    return sendMultipartPostRequest(getApiUrlByResourceType(ResourceType.VEDLEGG), formData);
};
export const deleteFile = (url: string) => axios.delete(url, axiosConfig);

export const isForbiddenOrUnauthorizedAndWillRedirectToLogin = (response: AxiosError): boolean => {
    if (isForbidden(response) || isUnauthorized(response)) {
        redirectToLoginPage();
        return true;
    } else {
        return false;
    }
};
