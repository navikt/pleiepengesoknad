import axios, { AxiosError } from 'axios';
import HttpStatus from 'http-status-codes';
import axiosConfig from '../config/axiosConfig';
import { ResourceType } from '../types/ResourceType';
import { getEnvironmentVariable } from './envUtils';

export const multipartConfig = { headers: { 'Content-Type': 'multipart/form-data' }, ...axiosConfig };

export const sendMultipartPostRequest = (url: string, formData: FormData) => {
    return axios.post(url, formData, multipartConfig);
};

export const isForbidden = ({ response }: AxiosError) =>
    response !== undefined && response.status === HttpStatus.FORBIDDEN;

export const isUnauthorized = ({ response }: AxiosError) =>
    response !== undefined && response.status === HttpStatus.UNAUTHORIZED;

export const getApiUrlByResourceType = (resourceType: ResourceType) => {
    return `${getEnvironmentVariable('API_URL')}/${resourceType}`;
};
