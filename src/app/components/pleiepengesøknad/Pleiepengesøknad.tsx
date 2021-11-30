import * as React from 'react';
import { TypedFormikWrapper } from '@navikt/sif-common-formik';
import { StepID } from '../../config/stepConfig';
import { initialValues, SøknadFormData } from '../../types/SøknadFormData';
import AppEssentialsLoader from '../app-essentials-loader/AppEssentialsLoader';

import PleiepengesøknadContent from '../pleiepengesøknad-content/PleiepengesøknadContent';

const Pleiepengesøknad = () => (
    <AppEssentialsLoader
        contentLoadedRenderer={(
            formdata: Partial<SøknadFormData>,
            harMellomlagring,
            lastStepID: StepID | undefined
        ) => {
            return (
                <TypedFormikWrapper<SøknadFormData>
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
