import axios from 'axios';
import axiosConfig from '../../config/axiosConfig';
import { ResourceType } from '../../types/ResourceType';
import { getEnvironmentVariable } from '../../utils/envUtils';

export const multipartConfig = { ...axiosConfig, headers: { 'Content-Type': 'multipart/form-data' } };
export const axiosJsonConfig = { ...axiosConfig, headers: { 'Content-type': 'application/json; charset=utf-8' } };

export const sendMultipartPostRequest = (url: string, formData: FormData) => {
    return axios.post(url, formData, multipartConfig);
};

export const getApiUrlByResourceType = (resourceType: ResourceType) => {
    return `${getEnvironmentVariable('API_URL')}/${resourceType}`;
};

export const apiUtils = {
    getApiUrlByResourceType,
    sendMultipartPostRequest,
};
