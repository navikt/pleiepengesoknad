import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { TypedFormikWrapper } from '@navikt/sif-common-formik';
import { initialValues, SøknadFormData } from '../types/SøknadFormData';
import { getSøknadsdataFromFormValues } from '../utils/formValuesToSøknadsdata/getSøknadsdataFromFormValues';
import { navigateToErrorPage } from '../utils/navigationUtils';
import SøknadContent from './SøknadContent';
import SøknadEssentialsLoader from './SøknadEssentialsLoader';
import SøknadsdataWrapper from './SøknadsdataWrapper';
import { StepID } from './søknadStepsConfig';
import { ApplikasjonHendelse, useAmplitudeInstance } from '@navikt/sif-common-amplitude/lib';

const Søknad = () => {
    const history = useHistory();
    const { logHendelse } = useAmplitudeInstance();
    const [søknadSent, setSøknadSent] = useState<boolean>(false);
    return (
        <SøknadEssentialsLoader
            onUgyldigMellomlagring={() => logHendelse(ApplikasjonHendelse.ugyldigMellomlagring)}
            onError={() => navigateToErrorPage(history)}
            contentLoadedRenderer={(formdata: SøknadFormData, harMellomlagring, lastStepID: StepID | undefined) => {
                const initialFormValues = formdata || initialValues;
                return (
                    <SøknadsdataWrapper initialSøknadsdata={getSøknadsdataFromFormValues(initialFormValues)}>
                        <TypedFormikWrapper<SøknadFormData>
                            initialValues={initialFormValues}
                            onSubmit={() => {
                                null;
                            }}
                            renderForm={(formik) => {
                                if (søknadSent) {
                                    setTimeout(() => {
                                        formik.resetForm();
                                        formik.setValues(initialValues);
                                    });
                                }
                                return (
                                    <SøknadContent
                                        lastStepID={lastStepID}
                                        harMellomlagring={søknadSent ? false : harMellomlagring}
                                        onSøknadSent={() => {
                                            setSøknadSent(true);
                                        }}
                                    />
                                );
                            }}
                        />
                    </SøknadsdataWrapper>
                );
            }}
        />
    );
};
export default Søknad;
