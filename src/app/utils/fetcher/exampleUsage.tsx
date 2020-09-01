import * as React from 'react';
import useFetcher from './fetcher';
import { fetch1 } from './fetcherUtils';
import { personRecipe, PersonResponse } from './exampleType';
import { AxiosError } from 'axios';
import { RemoteData } from '@devexperts/remote-data-ts';
import RemoteDataHandler from './RemoteDataHandler';
import GeneralErrorPage from '../../components/pages/general-error-page/GeneralErrorPage';
import LoadingPage from '../../components/pages/loading-page/LoadingPage';

const ExampleUsage = () => {
    const remoteData: RemoteData<AxiosError, [PersonResponse]> = useFetcher(() => fetch1([personRecipe]));

    return (
        <RemoteDataHandler<[PersonResponse]>
            remoteData={remoteData}
            error={(error: AxiosError) => <GeneralErrorPage error={error} />}
            initializing={() => <LoadingPage />}
            loading={() => <LoadingPage />}
            success={([person]: [PersonResponse]) => <div>Navn: {person.firstname}</div>}
        />
    );
};

export default ExampleUsage;
