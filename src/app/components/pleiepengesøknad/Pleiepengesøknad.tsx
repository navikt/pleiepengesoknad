import * as React from 'react';
import { TypedFormikWrapper } from '@sif-common/formik/';
import { StepID } from '../../config/stepConfig';
import { PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import AppEssentialsLoader from '../app-essentials-loader/AppEssentialsLoader';
import IkkeMyndigPage from '../pages/ikke-myndig-page/IkkeMyndigPage';
import PleiepengesøknadContent from '../pleiepengesøknad-content/PleiepengesøknadContent';
import Fetcher3 from '../../utils/fetcher/Fetcher3';
import { fetchMellomlagringDataRecipe, MellomlagringData } from '../../types/storage';
import { fetchPersonResponseRecipe, PersonResponse } from '../../types/PersonResponse';
import { BarnResponse, fetchBarnResponseRecipe } from '../../types/ListeAvBarn';
import HandleUnauthorized from '../../utils/handleUnauthorized/HandleUnauthorized';
import LoadingPage from '../pages/loading-page/LoadingPage';
import GeneralErrorPage from '../pages/general-error-page/GeneralErrorPage';
import { Søkerdata } from '../../types/Søkerdata';

const Pleiepengesøknad = () => (
    <Fetcher3<PersonResponse, BarnResponse, MellomlagringData>
        recipies={[fetchPersonResponseRecipe, fetchBarnResponseRecipe, fetchMellomlagringDataRecipe]}
        error={(error) => {
            return (
                <HandleUnauthorized
                    error={error}
                    onWillRedirect={() => <LoadingPage />}
                    handleError={() => <GeneralErrorPage />}
                />
            );
        }}
        loading={() => <LoadingPage />}
        success={([personResponse, barnResponse, mellomlagringData]: [
            PersonResponse,
            BarnResponse,
            MellomlagringData
        ]) => {
            return (
                <AppEssentialsLoader
                    person={personResponse}
                    barn={barnResponse.barn}
                    mellomlagringData={mellomlagringData}
                    contentLoadedRenderer={(
                        formdata: PleiepengesøknadFormData,
                        lastStepID: StepID,
                        søkerdata: Søkerdata | undefined
                    ) => {
                        if (søkerdata) {
                            const { person } = søkerdata;
                            if (!person.myndig) {
                                return <IkkeMyndigPage />;
                            }
                        }
                        return (
                            <TypedFormikWrapper<PleiepengesøknadFormData>
                                initialValues={formdata}
                                onSubmit={() => null}
                                renderForm={() => <PleiepengesøknadContent lastStepID={lastStepID} />}
                            />
                        );
                    }}
                />
            );
        }}
    />
);
export default Pleiepengesøknad;
