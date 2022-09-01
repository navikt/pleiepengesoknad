import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ApplikasjonHendelse, useAmplitudeInstance } from '@navikt/sif-common-amplitude/lib';
import { TypedFormikWrapper } from '@navikt/sif-common-formik';
import { initialValues, SøknadFormValues } from '../types/SøknadFormValues';
import { getSøknadsdataFromFormValues } from '../utils/formValuesToSøknadsdata/getSøknadsdataFromFormValues';
import { navigateToErrorPage } from '../utils/navigationUtils';
import SøknadContent from './SøknadContent';
import SøknadEssentialsLoader from './SøknadEssentialsLoader';
import SøknadsdataWrapper from './SøknadsdataWrapper';

const Søknad = () => {
    const history = useHistory();
    const { logHendelse } = useAmplitudeInstance();
    const [søknadSent, setSøknadSent] = useState<boolean>(false);
    const [søknadReset, setSøknadReset] = useState<boolean>(false);
    return (
        <SøknadEssentialsLoader
            onUgyldigMellomlagring={() => logHendelse(ApplikasjonHendelse.ugyldigMellomlagring)}
            onError={() => navigateToErrorPage(history)}
            contentLoadedRenderer={({ formdata, harMellomlagring, lastStepID, forrigeSøknad }) => {
                const initialFormValues = formdata || initialValues;
                return (
                    <SøknadsdataWrapper initialSøknadsdata={getSøknadsdataFromFormValues(initialFormValues)}>
                        <TypedFormikWrapper<SøknadFormValues>
                            initialValues={initialFormValues}
                            onSubmit={() => {
                                null;
                            }}
                            renderForm={(formik) => {
                                if (søknadSent && søknadReset === false) {
                                    setTimeout(() => {
                                        setSøknadReset(true);
                                        formik.resetForm({ values: initialValues, submitCount: 0 });
                                    });
                                }
                                return (
                                    <SøknadContent
                                        lastStepID={lastStepID}
                                        harMellomlagring={søknadSent ? false : harMellomlagring}
                                        forrigeSøknad={forrigeSøknad}
                                        onSøknadSent={() => {
                                            setSøknadSent(true);
                                        }}
                                        onSøknadStart={() => {
                                            setTimeout(() => {
                                                setSøknadSent(false);
                                                setSøknadReset(false);
                                            });
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
