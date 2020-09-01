import { AxiosRequestConfig } from 'axios';

export interface FetchRecipe<P> {
    url: string;
    axiosRequestConfig?: AxiosRequestConfig;
    typeguard: (value: any) => value is P;
}

export const defaultAxiosConfig: AxiosRequestConfig = {
    withCredentials: true,
};
