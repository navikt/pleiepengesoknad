import axios, { AxiosError } from 'axios';
import HttpStatus from 'http-status-codes';
import axiosConfig from '../config/axiosConfig';

export const sendMultipartPostRequest = (url: string, formData: FormData) =>
    axios.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' }, ...axiosConfig });

export const isForbidden = ({ response }: AxiosError) =>
    response !== undefined && response.status === HttpStatus.FORBIDDEN;

export const isUnauthorized = ({ response }: AxiosError) =>
    response !== undefined && response.status === HttpStatus.UNAUTHORIZED;
