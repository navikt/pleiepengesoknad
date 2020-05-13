import * as React from 'react';
import { TypedFormikWrapper } from '@navikt/sif-common-formik/lib';
import { StepID } from '../../config/stepConfig';
import { initialValues, PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import AppEssentialsLoader from '../app-essentials-loader/AppEssentialsLoader';
import IkkeMyndigPage from '../pages/ikke-myndig-page/IkkeMyndigPage';
import PleiepengesøknadContent from '../pleiepengesøknad-content/PleiepengesøknadContent';

const Pleiepengesøknad = () => (
    <AppEssentialsLoader
        contentLoadedRenderer={(formdata: PleiepengesøknadFormData, lastStepID: StepID, søkerdata) => {
            if (søkerdata) {
                const { person } = søkerdata;
                if (!person.myndig) {
                    return <IkkeMyndigPage />;
                }
            }
            return (
                <TypedFormikWrapper<PleiepengesøknadFormData>
                    initialValues={formdata || initialValues}
                    onSubmit={() => null}
                    renderForm={() => <PleiepengesøknadContent lastStepID={lastStepID} />}
                />
            );
        }}
    />
);
export default Pleiepengesøknad;
