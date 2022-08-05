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
    const [søknadReset, setSøknadReset] = useState<boolean>(false);
    console.log('render me');
    let søknadResetCount = 0;
    return (
        <SøknadEssentialsLoader
            onUgyldigMellomlagring={() => logHendelse(ApplikasjonHendelse.ugyldigMellomlagring)}
            onError={() => navigateToErrorPage(history)}
            contentLoadedRenderer={(formdata: SøknadFormData, harMellomlagring, lastStepID: StepID | undefined) => {
                const initialFormValues = søknadSent ? initialValues : formdata || initialValues;
                console.log('render me too', søknadSent, initialFormValues);
                return (
                    <SøknadsdataWrapper initialSøknadsdata={getSøknadsdataFromFormValues(initialFormValues)}>
                        <TypedFormikWrapper<SøknadFormData>
                            initialValues={initialFormValues}
                            onSubmit={() => {
                                null;
                            }}
                            renderForm={(formik) => {
                                if (søknadSent && søknadReset === false && søknadResetCount === 0) {
                                    setTimeout(() => {
                                        setSøknadReset(true);
                                        søknadResetCount++;
                                        formik.resetForm();
                                        formik.setValues(initialValues);
                                    });
                                }
                                console.log('and meee');
                                return (
                                    <SøknadContent
                                        lastStepID={lastStepID}
                                        harMellomlagring={søknadSent ? false : harMellomlagring}
                                        onSøknadSent={() => {
                                            console.log('Søknad sendt satt');
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
