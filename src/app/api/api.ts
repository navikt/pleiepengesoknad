import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
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
import { filterAndMapAttachmentsToApiFormat } from '../utils/formToApiMaps/attachmentsToApiData';

export const getPersistUrl = (lastStepID: StepID) =>
    `${getApiUrlByResourceType(ResourceType.MELLOMLAGRING)}?lastStepID=${encodeURI(lastStepID)}`;

export const persist = (formData: Partial<PleiepengesøknadFormData> | undefined, lastStepID: StepID) => {
    const url = getPersistUrl(lastStepID);
    if (formData) {
        const body: MellomlagringData = {
            formData,
            metadata: { lastStepID, version: MELLOMLAGRING_VERSION },
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

export const validateApplication = (data: PleiepengesøknadApiData) => {
    return axios.post(getApiUrlByResourceType(ResourceType.VALIDER_SOKNAD), data, axiosConfig);
};

interface ValidateAttachmentsResponse {
    vedleggId: string[];
}

export const verifyAttachmentsOnServer = (attachments: Attachment[]) => {
    const data = {
        vedleggId: filterAndMapAttachmentsToApiFormat(attachments),
    };
    return axios.post<ValidateAttachmentsResponse>(
        getApiUrlByResourceType(ResourceType.VALIDER_VEDLEGG),
        data,
        axiosConfig
    );
};

export const deleteFile = (url: string) => axios.delete(url, axiosConfig);
