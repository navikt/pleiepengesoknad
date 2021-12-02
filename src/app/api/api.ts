import { storageParser } from '@navikt/sif-common-core/lib/utils/persistence/persistence';
import axios, { AxiosResponse } from 'axios';
import axiosConfig from '../config/axiosConfig';
import { StepID } from '../søknad/søknadStepsConfig';
import { SøknadApiData } from '../types/SøknadApiData';
import { SøknadFormData } from '../types/SøknadFormData';
import { ResourceType } from '../types/ResourceType';
import { Arbeidsgiver } from '../types/Søkerdata';
import { getApiUrlByResourceType, axiosJsonConfig, sendMultipartPostRequest } from '../utils/apiUtils';
import { MELLOMLAGRING_VERSION, SøknadTempStorageData } from '../types/SøknadTempStorageData';
import { Feature, isFeatureEnabled } from '../utils/featureToggleUtils';

export const getPersistUrl = (stepID?: StepID) =>
    stepID
        ? `${getApiUrlByResourceType(ResourceType.MELLOMLAGRING)}?lastStepID=${encodeURI(stepID)}`
        : getApiUrlByResourceType(ResourceType.MELLOMLAGRING);

export const persist = (formData: Partial<SøknadFormData> | undefined, lastStepID?: StepID) => {
    if (isFeatureEnabled(Feature.DEMO_MODE)) {
        return Promise.resolve(undefined);
    }
    const url = getPersistUrl(lastStepID);
    if (formData) {
        const body: SøknadTempStorageData = {
            formData,
            metadata: {
                lastStepID,
                version: MELLOMLAGRING_VERSION,
                updatedTimestemp: new Date().toISOString(),
            },
        };
        return axios.put(url, { ...body }, axiosJsonConfig);
    } else {
        return axios.post(url, {}, axiosJsonConfig);
    }
};
export const rehydrate = () =>
    axios.get(getApiUrlByResourceType(ResourceType.MELLOMLAGRING), {
        ...axiosJsonConfig,
        transformResponse: storageParser,
    });
export const purge = () =>
    axios.delete(getApiUrlByResourceType(ResourceType.MELLOMLAGRING), { ...axiosConfig, data: {} });

export const getBarn = () => axios.get(getApiUrlByResourceType(ResourceType.BARN), axiosJsonConfig);
export const getSøker = () => axios.get(getApiUrlByResourceType(ResourceType.SØKER), axiosJsonConfig);
export const getArbeidsgiver = (
    fom: string,
    tom: string
): Promise<AxiosResponse<{ organisasjoner: Arbeidsgiver[] }>> => {
    return axios.get(
        `${getApiUrlByResourceType(ResourceType.ARBEIDSGIVER)}?fra_og_med=${fom}&til_og_med=${tom}`,
        axiosJsonConfig
    );
};

export const sendApplication = (data: SøknadApiData) =>
    axios.post(getApiUrlByResourceType(ResourceType.SEND_SØKNAD), data, axiosJsonConfig);

export const uploadFile = (file: File) => {
    const formData = new FormData();
    formData.append('vedlegg', file);
    return sendMultipartPostRequest(getApiUrlByResourceType(ResourceType.VEDLEGG), formData);
};
export const deleteFile = (url: string) => axios.delete(url, axiosConfig);
