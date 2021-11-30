import * as React from 'react';
import { TypedFormikWrapper } from '@navikt/sif-common-formik';
import { StepID } from '../../config/stepConfig';
import { initialValues, PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import AppEssentialsLoader from '../app-essentials-loader/AppEssentialsLoader';

import PleiepengesøknadContent from '../pleiepengesøknad-content/PleiepengesøknadContent';

const Pleiepengesøknad = () => (
    <AppEssentialsLoader
        contentLoadedRenderer={(
            formdata: Partial<PleiepengesøknadFormData>,
            harMellomlagring,
            lastStepID: StepID | undefined
        ) => {
            return (
                <TypedFormikWrapper<PleiepengesøknadFormData>
                    initialValues={formdata || initialValues}
                    onSubmit={() => {
                        null;
                    }}
                    renderForm={() => (
                        <PleiepengesøknadContent lastStepID={lastStepID} harMellomlagring={harMellomlagring} />
                    )}
                />
            );
        }}
    />
);
export default Pleiepengesøknad;
