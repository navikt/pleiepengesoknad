import axios, { AxiosError } from 'axios';
import HttpStatus from 'http-status-codes';
import { PleiepengesøknadApiData } from '../types/PleiepengesøknadApiData';
import { getEnvironmentVariable } from './envHelper';
const apiUrl = getEnvironmentVariable('API_URL');
const MockAdapter = require('axios-mock-adapter');
const mock = new MockAdapter(axios);
mock.onPost(`${apiUrl}/attachment`).reply(200, 'https://nav.no/');

export const getBarn = () => axios.get(`${apiUrl}/barn`, { withCredentials: true });

export const sendApplication = (data: PleiepengesøknadApiData) =>
    axios.post(`${apiUrl}/soknad`, data, { withCredentials: true });

export const uploadAttachment = (file: File) => axios.post(`${apiUrl}/attachment`, file, { withCredentials: true });

export const isForbidden = ({ response }: AxiosError) =>
    response !== undefined && response.status === HttpStatus.FORBIDDEN;

export const isUnauthorized = ({ response }: AxiosError) =>
    response !== undefined && response.status === HttpStatus.UNAUTHORIZED;
