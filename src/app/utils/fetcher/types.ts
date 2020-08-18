import { AxiosRequestConfig } from 'axios';
import * as IoTs from 'io-ts';

export interface FetchRecipe<P> {
    url: string;
    init?: AxiosRequestConfig;
    validator: IoTs.Type<P>;
}
