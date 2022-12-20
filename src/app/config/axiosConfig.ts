import { AxiosRequestConfig } from 'axios';
import { getEnvVariableOrDefault } from '../utils/envUtils';

const axiosConfigCommon: AxiosRequestConfig = {
    withCredentials: false,
    headers: { 'Content-type': 'application/json; charset=utf-8' },
};

export const axiosConfigPsb: AxiosRequestConfig = {
    ...axiosConfigCommon,
    baseURL: getEnvVariableOrDefault('FRONTEND_API_PATH', 'http://localhost:8082'),
};

export const axiosConfigInnsyn = {
    ...axiosConfigCommon,
    baseURL: getEnvVariableOrDefault('FRONTEND_INNSYN_API_PATH', 'http://localhost:8082'),
};
