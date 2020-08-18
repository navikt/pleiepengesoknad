import * as React from 'react';
import { useEffect, useState } from 'react';
import * as E from 'fp-ts/lib/Either';
import * as O from 'fp-ts/lib/Option';
import { fetchFunc1 } from './utilityFunctions';
import ResponseHandler from './ResponseHandler';
import { FetchRecipe } from './types';

interface FetcherProps<P1> {
    recipies: [FetchRecipe<P1>];
    loading: () => JSX.Element;
    error: (error: Error) => JSX.Element;
    success: (data: [P1]) => JSX.Element;
}

export interface FetcherState<P1> {
    fetchedData: E.Either<O.Option<Error>, [P1]>;
    doApiCalls: boolean;
}

export function Fetcher<P1>({ error, loading, recipies, success }: FetcherProps<P1>) {
    const [state, setState] = useState<FetcherState<P1>>({
        fetchedData: E.left(O.none),
        doApiCalls: true,
    });

    useEffect(() => {
        if (state.doApiCalls) {
            (async () => {
                const result: E.Either<Error, [P1]> = await fetchFunc1<P1>(recipies);
                setState({
                    fetchedData: E.fold<Error, [P1], E.Either<O.Option<Error>, [P1]>>(
                        (e: Error) => E.left(O.some<Error>(e)),
                        (theResult) => E.right(theResult)
                    )(result),
                    doApiCalls: false,
                });
            })();
        }
    });

    return <ResponseHandler<[P1]> data={state.fetchedData} loading={loading} error={error} success={success} />;
}

export default Fetcher;
