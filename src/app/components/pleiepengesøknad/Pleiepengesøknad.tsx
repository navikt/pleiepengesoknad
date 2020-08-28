import * as React from 'react';
import Fetcher3 from '../../utils/fetcher/Fetcher3';
import { fetchMaybeMellomlagringDataRecipe, MaybeMellomlagringData } from '../../types/storage';
import { fetchPersonResponseRecipe, PersonResponse } from '../../types/PersonResponse';
import { BarnResponse, fetchBarnResponseRecipe } from '../../types/ListeAvBarn';
import HandleUnauthorized from '../../utils/handleUnauthorized/HandleUnauthorized';
import LoadingPage from '../pages/loading-page/LoadingPage';
import GeneralErrorPage from '../pages/general-error-page/GeneralErrorPage';
import Something from './Something';

const Pleiepengesøknad = () => (
    <Fetcher3<PersonResponse, BarnResponse, MaybeMellomlagringData>
        recipies={[fetchPersonResponseRecipe, fetchBarnResponseRecipe, fetchMaybeMellomlagringDataRecipe]}
        error={(error) => (
            <HandleUnauthorized
                error={error}
                onWillRedirect={() => <LoadingPage />}
                handleError={() => <GeneralErrorPage />}
            />
        )}
        loading={() => <LoadingPage />}
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
export default Pleiepengesøknad;
