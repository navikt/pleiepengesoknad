import axios from 'axios';
import { axiosConfigPsb } from '../../config/axiosConfig';
import { ResourceType, ResourceTypeInnsyn } from '../../types/ResourceType';
import { getEnvironmentVariable } from '../../utils/envUtils';

export const multipartConfig = { ...axiosConfigPsb, headers: { 'Content-Type': 'multipart/form-data' } };
export const axiosJsonConfig = { ...axiosConfigPsb, headers: { 'Content-type': 'application/json; charset=utf-8' } };

export const sendMultipartPostRequest = (url: string, formData: FormData) => {
    return axios.post(url, formData, multipartConfig);
};

export const getApiUrlByResourceType = (resourceType: ResourceType) => {
    return `${getEnvironmentVariable('API_URL')}/${resourceType}`;
};

export const getInnsynApiUrlByResourceType = (resourceType: ResourceTypeInnsyn) => {
    return `${getEnvironmentVariable('API_URL_INNSYN')}/${resourceType}`;
};

export const apiUtils = {
    getApiUrlByResourceType,
    sendMultipartPostRequest,
};
