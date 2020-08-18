import * as React from 'react';
import { useEffect, useState } from 'react';
import * as E from 'fp-ts/lib/Either';
import * as O from 'fp-ts/lib/Option';
import { fetchFunc2 } from './utilityFunctions';
import ResponseHandler from './ResponseHandler';
import { FetchRecipe } from './types';

interface FetcherProps<P1, P2> {
    recipies: [FetchRecipe<P1>, FetchRecipe<P2>];
    loading: () => JSX.Element;
    error: (error: Error) => JSX.Element;
    success: (data: [P1, P2]) => JSX.Element;
}

export interface FetcherState<P1, P2> {
    fetchedData: E.Either<O.Option<Error>, [P1, P2]>;
    doApiCalls: boolean;
}

export function Fetcher2<P1, P2>({ error, loading, recipies, success }: FetcherProps<P1, P2>) {
    const [state, setState] = useState<FetcherState<P1, P2>>({
        fetchedData: E.left(O.none),
        doApiCalls: true,
    });

    useEffect(() => {
        if (state.doApiCalls) {
            (async () => {
                const result: E.Either<Error, [P1, P2]> = await fetchFunc2<P1, P2>(recipies);
                setState({
                    fetchedData: E.fold<Error, [P1, P2], E.Either<O.Option<Error>, [P1, P2]>>(
                        (e) => E.left(O.some(e)),
                        (justResult) => E.right(justResult)
                    )(result),
                    doApiCalls: false,
                });
            })();
        }
    });

    return <ResponseHandler<[P1, P2]> loading={loading} error={error} data={state.fetchedData} success={success} />;
}

export default Fetcher2;
