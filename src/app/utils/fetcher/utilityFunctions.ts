import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { sequenceT } from 'fp-ts/lib/Apply';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import * as IoTs from 'io-ts';
import prettyReporter from 'io-ts-reporters';
import { FetchRecipe } from './types';

export const defaultAxiosConfig: AxiosRequestConfig = {
    withCredentials: true,
};

export async function fetchType<P>(
    url: string,
    validator: IoTs.Type<P>,
    axiosConfig?: AxiosRequestConfig
): Promise<E.Either<Error, P>> {
    try {
        const axiosResponse: AxiosResponse<P> = await axios.get(url, axiosConfig || defaultAxiosConfig);
        const json = axiosResponse.data;
        const result: E.Either<IoTs.Errors, P> = validator.decode(json);
        return pipe(
            result,
            E.fold<IoTs.Errors, P, E.Either<Error, P>>(
                () =>
                    E.left<Error, P>({
                        name: 'TypeGuardError',
                        message: prettyReporter.report(result).join('\n'),
                    }),
                (value: P) => E.right<Error, P>(value)
            )
        );
    } catch (err) {
        return Promise.resolve(E.left<Error, P>(err));
    }
}

export async function fetchFunc1<P1>(recipies: [FetchRecipe<P1>]): Promise<E.Either<Error, [P1]>> {
    const [p1recipe] = recipies;
    const p1: E.Either<Error, P1> = await fetchType<P1>(p1recipe.url, p1recipe.validator, p1recipe.init);
    return Promise.resolve(sequenceT(E.either)(p1));
}

export async function fetchFunc2<P1, P2>(
    recipies: [FetchRecipe<P1>, FetchRecipe<P2>]
): Promise<E.Either<Error, [P1, P2]>> {
    const [p1recipe, p2recipe] = recipies;
    const p1: E.Either<Error, P1> = await fetchType<P1>(p1recipe.url, p1recipe.validator, p1recipe.init);
    const p2: E.Either<Error, P2> = await fetchType<P2>(p2recipe.url, p2recipe.validator, p2recipe.init);
    return Promise.resolve(sequenceT(E.either)(p1, p2));
}

export async function fetchFunc3<P1, P2, P3>(
    recipies: [FetchRecipe<P1>, FetchRecipe<P2>, FetchRecipe<P3>]
): Promise<E.Either<Error, [P1, P2, P3]>> {
    const [p1recipe, p2recipe, p3recipe] = recipies;
    const p1: E.Either<Error, P1> = await fetchType<P1>(p1recipe.url, p1recipe.validator, p1recipe.init);
    const p2: E.Either<Error, P2> = await fetchType<P2>(p2recipe.url, p2recipe.validator, p2recipe.init);
    const p3: E.Either<Error, P3> = await fetchType<P3>(p3recipe.url, p3recipe.validator, p3recipe.init);
    return Promise.resolve(sequenceT(E.either)(p1, p2, p3));
}
