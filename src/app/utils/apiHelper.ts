import axios, { AxiosError } from 'axios';
import HttpStatus from 'http-status-codes';
import { PleiepengesøknadApiData } from '../types/PleiepengesøknadApiData';
import { getEnvironmentVariable } from './envHelper';
const apiUrl = getEnvironmentVariable('API_URL');

const axiosConfig = { withCredentials: true };

export const getBarn = () => axios.get(`${apiUrl}/barn`, axiosConfig);

export const sendApplication = (data: PleiepengesøknadApiData) => axios.post(`${apiUrl}/soknad`, data, axiosConfig);

export const uploadFile = (file: File) => {
    const formData = new FormData();
    formData.append('vedlegg', file);
    return sendMultipartPostRequest(`${apiUrl}/vedlegg`, formData);
};

export const deleteFile = (url: string) => axios.delete(url);

const sendMultipartPostRequest = (url: string, formData: FormData) =>
    axios.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' }, ...axiosConfig });

export const isForbidden = ({ response }: AxiosError) =>
    response !== undefined && response.status === HttpStatus.FORBIDDEN;

export const isUnauthorized = ({ response }: AxiosError) =>
    response !== undefined && response.status === HttpStatus.UNAUTHORIZED;
