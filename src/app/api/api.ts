import { storageParser } from '@navikt/sif-common-core/lib/utils/persistence/persistence';
import axios, { AxiosResponse } from 'axios';
import axiosConfig from '../config/axiosConfig';
import { StepID } from '../config/stepConfig';
import { PleiepengesøknadApiData } from '../types/PleiepengesøknadApiData';
import { PleiepengesøknadFormData } from '../types/PleiepengesøknadFormData';
import { ResourceType } from '../types/ResourceType';
import { MELLOMLAGRING_VERSION, MellomlagringData } from '../types/storage';
import { Arbeidsgiver } from '../types/Søkerdata';
import { getApiUrlByResourceType, sendMultipartPostRequest } from '../utils/apiUtils';

export const getPersistUrl = (stepID?: StepID) =>
    stepID
        ? `${getApiUrlByResourceType(ResourceType.MELLOMLAGRING)}?lastStepID=${encodeURI(stepID)}`
        : getApiUrlByResourceType(ResourceType.MELLOMLAGRING);

export const persist = (formData: Partial<PleiepengesøknadFormData> | undefined, prevStep?: StepID) => {
    const url = getPersistUrl(prevStep);
    if (formData) {
        const body: MellomlagringData = {
            formData,
            metadata: { lastStepID: prevStep, version: MELLOMLAGRING_VERSION },
        };
        return axios.put(url, { ...body }, axiosConfig);
    } else {
        return axios.post(url, {}, axiosConfig);
    }
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
