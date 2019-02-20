import * as React from 'react';
import AppEssentialsLoader from '../app-essentials-loader/AppEssentialsLoader';
import FormikWrapper from '../formik-wrapper/FormikWrapper';
import PleiepengesøknadContent from '../pleiepengesøknad-content/PleiepengesøknadContent';

const Pleiepengesøknad = () => (
    <AppEssentialsLoader
        contentLoadedRenderer={() => (
            <FormikWrapper contentRenderer={(formikProps) => <PleiepengesøknadContent formikProps={formikProps} />} />
        )}
    />
);

export default Pleiepengesøknad;
