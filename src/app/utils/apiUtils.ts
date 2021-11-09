import axios, { AxiosError } from 'axios';
import HttpStatus, { StatusCodes } from 'http-status-codes';
import axiosConfig from '../config/axiosConfig';
import { ResourceType } from '../types/ResourceType';
import { getEnvironmentVariable } from './envUtils';

export const multipartConfig = { ...axiosConfig, headers: { 'Content-Type': 'multipart/form-data' } };
export const axiosJsonConfig = { ...axiosConfig, headers: { 'Content-type': 'application/json; charset=utf-8' } };

export const sendMultipartPostRequest = (url: string, formData: FormData) => {
    return axios.post(url, formData, multipartConfig);
};

export const isForbidden = ({ response }: AxiosError) =>
    response !== undefined &&
    (response.status === HttpStatus.FORBIDDEN || response.status === StatusCodes.UNAVAILABLE_FOR_LEGAL_REASONS);

export const isUnauthorized = ({ response }: AxiosError) =>
    response !== undefined && response.status === HttpStatus.UNAUTHORIZED;

export const getApiUrlByResourceType = (resourceType: ResourceType) => {
    return `${getEnvironmentVariable('API_URL')}/${resourceType}`;
};

export const apiUtils = {
    isForbidden,
    isUnauthorized,
    getApiUrlByResourceType,
    sendMultipartPostRequest,
};
