import { useEffect, useState } from 'react';
import { pending, RemoteData } from '@devexperts/remote-data-ts';
import { AxiosError } from 'axios';

type Data<T> = RemoteData<AxiosError, T>;

export function useFetcher<T>(fetcherFunc: () => Promise<RemoteData<AxiosError, T>>): RemoteData<AxiosError, T> {
    const [doApiCalls, setDoApiCalls] = useState<boolean>(true);
    const [data, setData] = useState<Data<T>>(pending);

    const runFetcherFunc = async () => {
        const response: RemoteData<AxiosError, T> = await fetcherFunc();
        setData(response);
    };

    useEffect(() => {
        if (doApiCalls) {
            setDoApiCalls(false);
            runFetcherFunc();
        }
    });

    return data;
}

export default useFetcher;
