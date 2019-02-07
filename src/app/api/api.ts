import axios from 'axios';
import { PleiepengesøknadApiData } from '../types/PleiepengesøknadApiData';
import { getEnvironmentVariable } from '../utils/envUtils';
import axiosConfig from '../config/axiosConfig';
import { sendMultipartPostRequest } from '../utils/apiUtils';

const apiUrl = getEnvironmentVariable('API_URL');

export const getBarn = () => axios.get(`${apiUrl}/barn`, axiosConfig);
export const getSøker = () => axios.get(`${apiUrl}/soker`, axiosConfig);
export const getAnsettelsesforhold = (fom: string, tom: string) =>
    axios.get(`${apiUrl}/ansettelsesforhold?fra_og_med=${fom}&til_og_med=${tom}`, axiosConfig);

export const sendApplication = (data: PleiepengesøknadApiData) => axios.post(`${apiUrl}/soknad`, data, axiosConfig);

export const uploadFile = (file: File) => {
    const formData = new FormData();
    formData.append('vedlegg', file);
    return sendMultipartPostRequest(`${apiUrl}/vedlegg`, formData);
};
export const deleteFile = (url: string) => axios.delete(url, axiosConfig);
