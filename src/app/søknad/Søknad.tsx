import React from 'react';
import { TypedFormikWrapper } from '@navikt/sif-common-formik';
import { initialValues, SøknadFormData } from '../types/SøknadFormData';
import SøknadContent from './SøknadContent';
import SøknadEssentialsLoader from './SøknadEssentialsLoader';
import { StepID } from './søknadStepsConfig';
import SøknadsdataWrapper from './SøknadsdataWrapper';
import { getSøknadsdataFromFormValues } from './søknadsdata-utils/getSøknadsdataFromFormValues';

const Søknad = () => {
    return (
        <SøknadEssentialsLoader
            contentLoadedRenderer={(formdata: SøknadFormData, harMellomlagring, lastStepID: StepID | undefined) => {
                const initialFormValues = formdata || initialValues;
                return (
                    <SøknadsdataWrapper initialSøknadsdata={getSøknadsdataFromFormValues(initialFormValues)}>
                        <TypedFormikWrapper<SøknadFormData>
                            initialValues={initialFormValues}
                            onSubmit={() => {
                                null;
                            }}
                            renderForm={() => {
                                return <SøknadContent lastStepID={lastStepID} harMellomlagring={harMellomlagring} />;
                            }}
                        />
                    </SøknadsdataWrapper>
                );
            }}
        />
    );
};
export default Søknad;
