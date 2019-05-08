import * as React from 'react';
import AppEssentialsLoader from '../app-essentials-loader/AppEssentialsLoader';
import FormikWrapper from '../formik-wrapper/FormikWrapper';
import PleiepengesøknadContent from '../pleiepengesøknad-content/PleiepengesøknadContent';
import PleiepengesøknadBlocker from '../pleiepengesøknad-blocker/PleiepengesøknadBlocker';

const renderPleiepengesøknadContent = () => (
    <FormikWrapper contentRenderer={(formikProps) => <PleiepengesøknadContent formikProps={formikProps} />} />
);

const renderPleiepengesøknadBlocker = () => <PleiepengesøknadBlocker />;

const Pleiepengesøknad = () => (
    <AppEssentialsLoader
        contentLoadedRenderer={(søkerdata) => {
            if (søkerdata) {
                const { person } = søkerdata;
                if (person.myndig) {
                    return renderPleiepengesøknadContent();
                } else {
                    return renderPleiepengesøknadBlocker();
                }
            }
            return null;
        }}
    />
);

export default Pleiepengesøknad;
