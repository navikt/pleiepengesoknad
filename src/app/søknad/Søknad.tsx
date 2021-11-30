import * as React from 'react';
import { TypedFormikWrapper } from '@navikt/sif-common-formik';
import { StepID } from './søknadStepsConfig';
import { initialValues, SøknadFormData } from '../types/SøknadFormData';
import SøknadEssentialsLoader from './SøknadEssentialsLoader';

import SøknadContent from './SøknadContent';

const Søknad = () => (
    <SøknadEssentialsLoader
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
                    renderForm={() => <SøknadContent lastStepID={lastStepID} harMellomlagring={harMellomlagring} />}
                />
            );
        }}
    />
);
export default Søknad;
