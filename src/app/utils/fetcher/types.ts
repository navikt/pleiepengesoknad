import { AxiosRequestConfig } from 'axios';

export interface FetchRecipe<P> {
    url: string;
    typeguard: (value: any) => value is P;
    axiosRequestConfig?: AxiosRequestConfig;
}

export const defaultAxiosConfig: AxiosRequestConfig = {
    withCredentials: true,
};
