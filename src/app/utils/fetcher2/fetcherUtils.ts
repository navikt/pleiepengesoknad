import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { combine, failure, RemoteData, success } from '@devexperts/remote-data-ts';
import { defaultAxiosConfig, FetchRecipe } from './types';

export const newAxiosError = (name: string, message: string, config: AxiosRequestConfig): AxiosError => {
    return {
        name,
        message,
        config,
        isAxiosError: false,
        toJSON: () => ({}),
    };
};

export async function fetchType<P>({
    url,
    typeguard: isP,
    axiosRequestConfig,
}: FetchRecipe<P>): Promise<RemoteData<AxiosError, P>> {
    try {
        const axiosResponse: AxiosResponse<P> = await axios.get(url, axiosRequestConfig || defaultAxiosConfig);
        const json = axiosResponse.data;
        return Promise.resolve(
            isP(json)
                ? success(json)
                : failure(
                      newAxiosError(
                          'typeguardError',
                          `JSON received from ${url} cannot be decoded`,
                          axiosRequestConfig || defaultAxiosConfig
                      )
                  )
        );
    } catch (err) {
        return Promise.resolve(failure(err));
    }
}

export async function fetch1<P1>(recipies: [FetchRecipe<P1>]): Promise<RemoteData<AxiosError, [P1]>> {
    const [p1recipe] = recipies;
    const p1: RemoteData<AxiosError, P1> = await fetchType<P1>(p1recipe);
    return Promise.resolve(combine(p1));
}

export async function fetch2<P1, P2>(
    recipies: [FetchRecipe<P1>, FetchRecipe<P2>]
): Promise<RemoteData<AxiosError, [P1, P2]>> {
    const [p1recipe, p2recipe] = recipies;
    const p1: RemoteData<AxiosError, P1> = await fetchType<P1>(p1recipe);
    const p2: RemoteData<AxiosError, P2> = await fetchType<P2>(p2recipe);
    return Promise.resolve(combine(p1, p2));
}

export async function fetch3<P1, P2, P3>(
    recipies: [FetchRecipe<P1>, FetchRecipe<P2>, FetchRecipe<P3>]
): Promise<RemoteData<AxiosError, [P1, P2, P3]>> {
    const [p1recipe, p2recipe, p3recipe] = recipies;
    const p1: RemoteData<AxiosError, P1> = await fetchType<P1>(p1recipe);
    const p2: RemoteData<AxiosError, P2> = await fetchType<P2>(p2recipe);
    const p3: RemoteData<AxiosError, P3> = await fetchType<P3>(p3recipe);
    return Promise.resolve(combine(p1, p2, p3));
}

export async function fetch4<P1, P2, P3, P4>(
    recipies: [FetchRecipe<P1>, FetchRecipe<P2>, FetchRecipe<P3>, FetchRecipe<P4>]
): Promise<RemoteData<AxiosError, [P1, P2, P3, P4]>> {
    const [p1recipe, p2recipe, p3recipe, p4recipe] = recipies;
    const p1: RemoteData<AxiosError, P1> = await fetchType<P1>(p1recipe);
    const p2: RemoteData<AxiosError, P2> = await fetchType<P2>(p2recipe);
    const p3: RemoteData<AxiosError, P3> = await fetchType<P3>(p3recipe);
    const p4: RemoteData<AxiosError, P4> = await fetchType<P4>(p4recipe);
    return Promise.resolve(combine(p1, p2, p3, p4));
}

export async function fetch5<P1, P2, P3, P4, P5>(
    recipies: [FetchRecipe<P1>, FetchRecipe<P2>, FetchRecipe<P3>, FetchRecipe<P4>, FetchRecipe<P5>]
): Promise<RemoteData<AxiosError, [P1, P2, P3, P4, P5]>> {
    const [p1recipe, p2recipe, p3recipe, p4recipe, p5recipe] = recipies;
    const p1: RemoteData<AxiosError, P1> = await fetchType<P1>(p1recipe);
    const p2: RemoteData<AxiosError, P2> = await fetchType<P2>(p2recipe);
    const p3: RemoteData<AxiosError, P3> = await fetchType<P3>(p3recipe);
    const p4: RemoteData<AxiosError, P4> = await fetchType<P4>(p4recipe);
    const p5: RemoteData<AxiosError, P5> = await fetchType<P5>(p5recipe);
    return Promise.resolve(combine(p1, p2, p3, p4, p5));
}
