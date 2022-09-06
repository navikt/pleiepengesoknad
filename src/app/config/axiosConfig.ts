import { AxiosRequestConfig } from 'axios';
import { getEnvVariableOrDefault } from '../utils/envUtils';

const axiosConfigCommon: AxiosRequestConfig = {
    withCredentials: true,
    headers: { 'Content-type': 'application/json; charset=utf-8' },
};

export const axiosConfigPsb: AxiosRequestConfig = {
    ...axiosConfigCommon,
    baseURL: getEnvVariableOrDefault('API_URL', 'http://localhost:8082'),
};

export const axiosConfigInnsyn = {
    ...axiosConfigCommon,
    baseURL: getEnvVariableOrDefault('API_URL_INNSYN', 'http://localhost:8082'),
};
