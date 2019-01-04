import { AxiosError } from 'axios';
import HttpStatus from 'http-status-codes';

export const isForbidden = ({ code, response }: AxiosError) => response && response.status === HttpStatus.FORBIDDEN;

export const isUnauthorized = ({ code, response }: AxiosError) =>
    response && response.status === HttpStatus.UNAUTHORIZED;
