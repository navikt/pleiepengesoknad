import * as React from 'react';
import { fetcherMaybeMellomlagringDataRecipe, MaybeMellomlagringData } from '../../types/storage';
import { fetcherPersonResponseRecipe, PersonResponse } from '../../types/PersonResponse';
import RedirectIfUnauthorized from '../../utils/handleUnauthorized/RedirectIfUnauthorized';
import LoadingPage from '../pages/loading-page/LoadingPage';
import GeneralErrorPage from '../pages/general-error-page/GeneralErrorPage';
import Something from './Something';
import useFetcher from '../../utils/fetcher2/fetcher';
import RemoteDataHandler from '../../utils/fetcher2/RemoteDataHandler';
import { RemoteData } from '@devexperts/remote-data-ts';
import { fetch3 } from '../../utils/fetcher2/fetcherUtils';
import { BarnResponse, fetcherBarnResponseRecipe } from '../../types/BarnResponse';
import { AxiosError } from 'axios';

const Pleiepengesøknad = () => {
    const remoteData: RemoteData<AxiosError, [PersonResponse, BarnResponse, MaybeMellomlagringData]> = useFetcher(() =>
        fetch3([fetcherPersonResponseRecipe, fetcherBarnResponseRecipe, fetcherMaybeMellomlagringDataRecipe])
    );

    return (
        <RemoteDataHandler<[PersonResponse, BarnResponse, MaybeMellomlagringData]>
            remoteData={remoteData}
            initializing={LoadingPage}
            loading={LoadingPage}
            error={(error) => (
                <RedirectIfUnauthorized
                    error={error}
                    onWillRedirect={() => <LoadingPage />}
                    handleError={(error: Error) => <GeneralErrorPage error={error} />}
                />
            )}
            success={([personResponse, barnResponse, maybeMellomlagringData]: [
                PersonResponse,
                BarnResponse,
                MaybeMellomlagringData
            ]) => (
                <Something
                    personResponse={personResponse}
                    barnResponse={barnResponse}
                    maybeMellomlagringData={maybeMellomlagringData}
                />
            )}
        />
    );
};
export default Pleiepengesøknad;
