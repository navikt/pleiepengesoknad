import { useEffect, useState } from 'react';
import { pending, RemoteData } from '@devexperts/remote-data-ts';
import { AxiosError } from 'axios';

interface State<T> {
    doApiCalls: boolean;
    data: RemoteData<AxiosError, T>;
}

export function useFetcher<T>(fetcherFunc: () => Promise<RemoteData<AxiosError, T>>): RemoteData<AxiosError, T> {
    const [state, setState] = useState<State<T>>({ doApiCalls: true, data: pending });
    const { doApiCalls, data } = state;

    const runFetcherFunc = async () => {
        const response: RemoteData<AxiosError, T> = await fetcherFunc();
        setState({ doApiCalls: false, data: response });
    };

    useEffect(() => {
        if (doApiCalls) {
            runFetcherFunc();
        }
    });

    return data;
}

export default useFetcher;
