import * as React from 'react';
import AppEssentialsLoader from '../app-essentials-loader/AppEssentialsLoader';
import FormikWrapper from '../formik-wrapper/FormikWrapper';
import PleiepengesøknadContent from '../pleiepengesøknad-content/PleiepengesøknadContent';
import IkkeMyndigPage from '../pages/ikke-myndig-page/IkkeMyndigPage';
import { PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { StepID } from '../../config/stepConfig';

const renderPleiepengesøknadContent = (lastStepID: StepID, formdata: PleiepengesøknadFormData) => (
    <FormikWrapper formdata={formdata} contentRenderer={(formikProps) => <PleiepengesøknadContent lastStepID={lastStepID} formikProps={formikProps} />} />
)

const Pleiepengesøknad = () => (
    <AppEssentialsLoader
        contentLoadedRenderer={(formdata: PleiepengesøknadFormData, lastStepID: StepID, søkerdata) => {
            if (søkerdata) {
                const { person } = søkerdata;
                if (!person.myndig) {
                    return <IkkeMyndigPage />;
                }
            }
            return renderPleiepengesøknadContent(lastStepID, formdata);
        }}
    />
);
export default Pleiepengesøknad;
