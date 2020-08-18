import * as React from 'react';
import { useEffect, useState } from 'react';
import * as E from 'fp-ts/lib/Either';
import * as O from 'fp-ts/lib/Option';
import { fetchFunc3 } from './utilityFunctions';
import ResponseHandler from './ResponseHandler';
import { FetchRecipe } from './types';

interface FetcherProps<P1, P2, P3> {
    recipies: [FetchRecipe<P1>, FetchRecipe<P2>, FetchRecipe<P3>];
    loading: () => JSX.Element;
    error: (error: Error) => JSX.Element;
    success: (data: [P1, P2, P3]) => JSX.Element;
}

export interface FetcherState<P1, P2, P3> {
    response: E.Either<O.Option<Error>, [P1, P2, P3]>;
    doApiCalls: boolean;
}

export function Fetcher3<P1, P2, P3>({ error, loading, recipies, success }: FetcherProps<P1, P2, P3>) {
    const [state, setState] = useState<FetcherState<P1, P2, P3>>({
        response: E.left(O.none),
        doApiCalls: true,
    });

    useEffect(() => {
        if (state.doApiCalls) {
            (async () => {
                const response: E.Either<Error, [P1, P2, P3]> = await fetchFunc3<P1, P2, P3>(recipies);
                setState({
                    response: E.fold<Error, [P1, P2, P3], E.Either<O.Option<Error>, [P1, P2, P3]>>(
                        (e) => E.left(O.some(e)),
                        (data) => E.right(data)
                    )(response),
                    doApiCalls: false,
                });
            })();
        }
    });

    return <ResponseHandler<[P1, P2, P3]> loading={loading} error={error} data={state.response} success={success} />;
}

export default Fetcher3;
