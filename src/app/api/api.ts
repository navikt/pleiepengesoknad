import axios from 'axios';
import { PleiepengesøknadApiData } from '../types/PleiepengesøknadApiData';
import axiosConfig from '../config/axiosConfig';
import { getApiUrlByResourceType, sendMultipartPostRequest } from '../utils/apiUtils';
import { ResourceType } from '../types/ResourceType';

export const getBarn = () => axios.get(getApiUrlByResourceType(ResourceType.BARN), axiosConfig);
export const getSøker = () => axios.get(getApiUrlByResourceType(ResourceType.SØKER), axiosConfig);
export const getArbeidsgiver = (fom: string, tom: string) =>
    axios.get(`${getApiUrlByResourceType(ResourceType.ARBEIDSGIVER)}?fra_og_med=${fom}&til_og_med=${tom}`, axiosConfig);

export const sendApplication = (data: PleiepengesøknadApiData) =>
    axios.post(getApiUrlByResourceType(ResourceType.SEND_SØKNAD), data, axiosConfig);

export const uploadFile = (file: File) => {
    const formData = new FormData();
    formData.append('vedlegg', file);
    return sendMultipartPostRequest(getApiUrlByResourceType(ResourceType.VEDLEGG), formData);
};
export const deleteFile = (url: string) => axios.delete(url, axiosConfig);
