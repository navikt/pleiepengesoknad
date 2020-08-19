import * as React from 'react';
import { TypedFormikWrapper } from '@navikt/sif-common-formik/lib';
import { StepID } from '../../config/stepConfig';
import { PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import AppEssentials from '../app-essentials-loader/AppEssentials';
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
import { FormikProps } from 'formik';

const Pleiepengesøknad = () => (
    <Fetcher3<PersonResponse, BarnResponse, MellomlagringData>
        recipies={[fetchPersonResponseRecipe, fetchBarnResponseRecipe, fetchMellomlagringDataRecipe]}
        error={(error) => (
            <HandleUnauthorized
                error={error}
                onWillRedirect={() => <LoadingPage />}
                handleError={() => <GeneralErrorPage />}
            />
        )}
        loading={() => <LoadingPage />}
        success={([personResponse, barnResponse, mellomlagringData]: [
            PersonResponse,
            BarnResponse,
            MellomlagringData
        ]) => (
            <AppEssentials
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
                            renderForm={(formikProps: FormikProps<PleiepengesøknadFormData>) => (
                                <PleiepengesøknadContent lastStepID={lastStepID} formikProps={formikProps} />
                            )}
                        />
                    );
                }}
            />
        )}
    />
);
export default Pleiepengesøknad;
